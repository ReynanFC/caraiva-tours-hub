package com.caraivatours.hub.booking;

import com.caraivatours.hub.booking.dto.request.CreateBookingRequest;
import com.caraivatours.hub.booking.dto.request.UpdateBookingRequest;
import com.caraivatours.hub.booking.dto.response.BookingDetailDTO;
import com.caraivatours.hub.booking.dto.response.BookingSummaryDTO;
import com.caraivatours.hub.booking.enums.BookingStatus;
import com.caraivatours.hub.booking.event.BookingStatusChangedEvent;
import com.caraivatours.hub.client.Client;
import com.caraivatours.hub.client.ClientService;
import com.caraivatours.hub.groupmember.GroupMember;
import com.caraivatours.hub.groupmember.GroupMemberRepository;
import com.caraivatours.hub.groupmember.GroupMemberService;
import com.caraivatours.hub.groupmember.dto.GroupMemberDTO;
import com.caraivatours.hub.payment.PaymentService;
import com.caraivatours.hub.pickuplocation.PickupLocation;
import com.caraivatours.hub.pickuplocation.PickupLocationRepository;
import com.caraivatours.hub.pickuplocation.dto.PickupDTO;
import com.caraivatours.hub.shared.dto.PagedResult;
import com.caraivatours.hub.shared.exceptions.BadRequestException;
import com.caraivatours.hub.shared.exceptions.ResourceNotFoundException;
import com.caraivatours.hub.tour.TourRepository;
import com.caraivatours.hub.tour.entity.Tour;
import com.caraivatours.hub.user.User;
import com.caraivatours.hub.user.UserRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.context.ApplicationEventPublisher;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.util.StringUtils;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.Set;
import java.util.stream.Collectors;

import org.springframework.cache.annotation.CacheEvict;
import org.springframework.cache.annotation.Cacheable;

@Slf4j
@Transactional(readOnly = true)
@Service
@RequiredArgsConstructor
public class BookingService {

    private final BookingRepository bookingRepository;
    private final TourRepository tourRepository;
    private final UserRepository userRepository;
    private final PickupLocationRepository pickupLocationRepository;
    private final GroupMemberRepository groupMemberRepository;
    private final BookingMapper bookingMapper;
    private final ApplicationEventPublisher eventPublisher;
    private final ClientService clientService;
    private final PaymentService paymentService;
    private final GroupMemberService groupMemberService;

    @Cacheable(
            value = "bookings",
            key = "'all:' + #search + ':' + #pageable.pageNumber + ':' + #pageable.pageSize + ':' + #pageable.sort",
            condition = "#search == null || #search.isEmpty()"
    )
    public PagedResult<BookingSummaryDTO> findAll(String search, Pageable pageable) {
        log.info("Fetching all bookings with search filter: '{}'", search);

        Page<BookingSummaryDTO> bookings = bookingRepository.findAll(search, pageable);

        return PagedResult.from(bookings);
    }

    @Cacheable(
            value = "bookings",
            key = "'status:' + #status + ':' + #pageable.pageNumber + ':' + #pageable.pageSize + ':' + #pageable.sort",
            condition = "#status == null"
    )
    public PagedResult<BookingSummaryDTO> findByStatus(BookingStatus status, Pageable pageable) {
        log.info("Filtering bookings by status: {}", status);

        Page<BookingSummaryDTO> bookings = bookingRepository.findByCurrentStatus(status, pageable);

        return PagedResult.from(bookings);
    }

    @Cacheable(value = "booking-details", key = "#id")
    public BookingDetailDTO findDetailsBooking(Long id) {
        log.info("Retrieving booking details with id: {}", id);

        Booking entity = bookingRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Booking not found with id: " + id));

        return bookingMapper.toDetail(entity);
    }

    public Set<GroupMemberDTO> findGroupMembers(Long bookingId) {
        log.info("Fetching group members for Booking ID: {}", bookingId);

        Booking booking = bookingRepository.findById(bookingId)
                .orElseThrow(() -> new ResourceNotFoundException("Booking not found with ID: " + bookingId));

        validateBookingStateForModification(booking);

        Set<GroupMember> members = groupMemberRepository.findByBookingId(bookingId);
        log.debug("Found {} group members for Booking ID: {}", members.size(), bookingId);

        return members.stream()
                .map(member -> new GroupMemberDTO(member.getName(), member.isLapChild()))
                .collect(Collectors.toSet());
    }

    @Transactional
    @CacheEvict(value = {"bookings", "booking-details"}, allEntries = true)
    public BookingSummaryDTO createBooking(Long attendantId, CreateBookingRequest req) {
        log.info("Starting booking creation process for Tour ID: {} by Attendant ID: {}", req.tourId(), attendantId);
        log.debug("Received create booking payload: {}", req);

        User user = userRepository.findById(attendantId)
                .orElseThrow(() -> new ResourceNotFoundException("User not found with ID: " + attendantId));

        Tour tour = tourRepository.findById(req.tourId())
                .orElseThrow(() -> new ResourceNotFoundException("Tour not found with ID: " + req.tourId()));

        Client client = clientService.findOrCreate(req.client());
        log.debug("Client resolved/created successfully: {}", client.getId());

        PickupLocation pickup = pickupLocationRepository.save(createPickupLocation(req.pickup()));
        BookingStatus status = getStatus(req.pixPaymentUrl());

        Booking entity = Booking.builder()
                .attendant(user)
                .client(client)
                .tour(tour)
                .pickupLocation(pickup)
                .customSchedule(req.scheduleDate())
                .currentStatus(status)
                .build();

        Set<GroupMember> members = groupMemberService.createForBooking(entity, req.members());
        members.forEach(entity::addGroupMember);

        int totalParticipants = Booking.calculateTotalParticipants(req.members().size());
        entity.updateFinancials(tour.getEffectivePrice(), totalParticipants, req.manualDiscount());
        log.debug("Booking financials updated. Total participants: {}, Manual discount: {}", totalParticipants, req.manualDiscount());

        Booking savedBooking = bookingRepository.save(entity);

        if (StringUtils.hasText(req.pixPaymentUrl())) {
            log.info("Creating reservation payment with URL: {}", req.pixPaymentUrl());
            paymentService.createReservationPayment(savedBooking, req.pixPaymentUrl());
        }

        log.info("Booking created successfully. Generated ID: {}, Initial Status: {}", savedBooking.getId(), status);

        eventPublisher.publishEvent(new BookingStatusChangedEvent(
                savedBooking.getId(), null, status, attendantId, "Created booking"
        ));

        return bookingMapper.toSummary(savedBooking);
    }

    @Transactional
    @CacheEvict(value = {"bookings", "booking-details"}, allEntries = true)
    public BookingSummaryDTO confirmBooking(Long bookingId, Long attendantId) {
        Booking entity = bookingRepository.findById(bookingId)
                .orElseThrow(() -> new ResourceNotFoundException("Booking not found with ID: " + bookingId));

        changeStatus(entity, BookingStatus.CONFIRMED, attendantId, "Booking confirmed");

        return bookingMapper.toSummary(entity);
    }

    @Transactional
    @CacheEvict(value = {"bookings", "booking-details"}, allEntries = true)
    public BookingSummaryDTO updateBooking(Long bookingId, UpdateBookingRequest request) {
        log.info("Starting update process for Booking ID: {}", bookingId);
        log.debug("Update request payload for Booking ID {}: {}", bookingId, request);

        Booking entity = bookingRepository.findById(bookingId)
                .orElseThrow(() -> new ResourceNotFoundException("Booking not found with ID: " + bookingId));

        validateBookingStateForModification(entity);

        clientService.updateClientData(entity.getClient(), request.clientName(), request.clientPhone());

        boolean tourChanged = applyTourChangeIfPresent(entity, request.tourId());
        applyScheduleChangeIfPresent(entity, request.scheduleDate());
        boolean membersChanged = applyMembersChangeIfPresent(entity, request.members());

        boolean shouldRecalculate = tourChanged || membersChanged || request.manualDiscount() != null;
        if (shouldRecalculate) {
            log.info("Financial recalculation triggered for Booking ID: {} (Tour Changed: {}, Members Changed: {}, Discount Updated: {})",
                    bookingId, tourChanged, membersChanged, request.manualDiscount() != null);
            recalculateFinancialsAndPayments(entity, request.manualDiscount());
        }

        log.info("Booking ID: {} updated successfully", bookingId);
        return bookingMapper.toSummary(entity);
    }

    private void validateBookingStateForModification(Booking booking) {
        BookingStatus status = booking.getCurrentStatus();

        if (status == BookingStatus.COMPLETED || status == BookingStatus.CANCELLED || status == BookingStatus.CANCEL_REQUEST) {
            log.warn("Attempted operation on Booking ID {} with invalid status: {}", booking.getId(), status);
            throw new BadRequestException("This Booking cannot be changed/accessed because its status is: " + status.name());
        }
    }

    private boolean applyTourChangeIfPresent(Booking booking, Long newTourId) {
        if (newTourId == null) {
            return false;
        }

        if (newTourId.equals(booking.getTour().getId())) {
            log.debug("Tour ID {} is already assigned to Booking ID: {}. Skipping update.", newTourId, booking.getId());
            return false;
        }

        log.info("Updating Tour for Booking ID: {} from Tour ID {} to Tour ID {}",
                booking.getId(), booking.getTour().getId(), newTourId);

        Tour newTour = tourRepository.findById(newTourId)
                .orElseThrow(() -> new ResourceNotFoundException("Tour not found with ID: " + newTourId));

        booking.setTour(newTour);
        return true;
    }

    private void applyScheduleChangeIfPresent(Booking booking, LocalDateTime newScheduleDate) {
        if (newScheduleDate != null) {
            log.info("Updating schedule date for Booking ID: {} to {}", booking.getId(), newScheduleDate);
            booking.setCustomSchedule(newScheduleDate);
        }
    }

    private boolean applyMembersChangeIfPresent(Booking booking, Set<GroupMemberDTO> newMembers) {
        if (newMembers == null) {
            return false;
        }

        log.info("Updating group members for Booking ID: {}. New member count: {}", booking.getId(), newMembers.size());
        Set<GroupMember> members = groupMemberService.createForBooking(booking, newMembers);
        booking.replaceGroupMembers(members);
        return true;
    }

    private void recalculateFinancialsAndPayments(Booking booking, BigDecimal newManualDiscount) {
        BigDecimal discount = newManualDiscount != null
                ? newManualDiscount
                : booking.getFinancialData().manualDiscount();

        int totalParticipants = Booking.calculateTotalParticipants(booking.getGroupMembers().size());

        booking.updateFinancials(
                booking.getTour().getEffectivePrice(),
                totalParticipants,
                discount
        );
        log.debug("Financials recalculated for Booking ID: {}. Effective Price: {}, Total Participants: {}, Discount: {}",
                booking.getId(), booking.getTour().getEffectivePrice(), totalParticipants, discount);

        paymentService.updateExpectedAmount(booking);
        log.debug("Expected payment amount updated via PaymentService for Booking ID: {}", booking.getId());
    }

    private void changeStatus(Booking booking, BookingStatus newStatus, Long userId, String reason) {
        var previousStatus = booking.getCurrentStatus();
        booking.setCurrentStatus(newStatus);
        bookingRepository.save(booking);

        eventPublisher.publishEvent(new BookingStatusChangedEvent(
                booking.getId(), previousStatus, newStatus, userId, reason
        ));
    }

    private PickupLocation createPickupLocation(PickupDTO dto) {
        log.debug("Processing pickup location. Postal Code: {}, Name: {}", dto.cep(), dto.locationName());

        return new PickupLocation(
                dto.cep(), dto.locationName(), dto.referencePoint(), dto.appliedPickupFee()
        );
    }

    private BookingStatus getStatus(String pixPaymentUrl) {
        BookingStatus status = StringUtils.hasText(pixPaymentUrl) ? BookingStatus.CONFIRMED : BookingStatus.DRAFT;
        log.debug("Booking status evaluated to: {} (Has Pix URL: {})", status, StringUtils.hasText(pixPaymentUrl));

        return status;
    }
}

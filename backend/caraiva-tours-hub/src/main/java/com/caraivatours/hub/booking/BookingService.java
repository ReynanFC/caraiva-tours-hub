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
import com.caraivatours.hub.groupmember.GroupMemberService;
import com.caraivatours.hub.groupmember.dto.GroupMemberDTO;
import com.caraivatours.hub.payment.PaymentService;
import com.caraivatours.hub.pickuplocation.PickupLocation;
import com.caraivatours.hub.pickuplocation.PickupLocationService;
import com.caraivatours.hub.shared.dto.PagedResult;
import com.caraivatours.hub.shared.exceptions.BadRequestException;
import com.caraivatours.hub.shared.exceptions.ResourceNotFoundException;
import com.caraivatours.hub.tour.TourService;
import com.caraivatours.hub.tour.entity.Tour;
import com.caraivatours.hub.user.User;
import com.caraivatours.hub.user.UserService;
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

import org.springframework.cache.annotation.CacheEvict;
import org.springframework.cache.annotation.Cacheable;

@Slf4j
@Transactional(readOnly = true)
@Service
@RequiredArgsConstructor
public class BookingService {

    private final BookingRepository bookingRepository;
    private final BookingMapper bookingMapper;
    private final TourService tourService;
    private final UserService userService;
    private final PickupLocationService pickupService;
    private final ClientService clientService;
    private final PaymentService paymentService;
    private final GroupMemberService groupMemberService;
    private final ApplicationEventPublisher eventPublisher;

    public Booking findById(Long id) {
        return bookingRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Booking not found with ID: " + id));
    }

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

    @Transactional
    @CacheEvict(value = {"bookings", "booking-details"}, allEntries = true)
    /**
     * Creates a booking with its immutable financial snapshot, group members and optional 20% deposit.
     * It also emits the initial status event used by the booking history.
     */
    public BookingSummaryDTO createBooking(Long attendantId, CreateBookingRequest req) {
        log.info("Starting booking creation process for Tour ID: {} by Attendant ID: {}", req.tourId(), attendantId);
        log.debug("Received create booking payload: {}", req);

        User user = userService.findById(attendantId);
        Tour tour = tourService.findById(req.tourId());

        Client client = clientService.findOrCreate(req.client());
        log.debug("Client resolved/created successfully: {}", client.getId());

        PickupLocation pickup = pickupService.createPickupLocation(req.pickup());
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
    /**
     * Marks the tour as completed and records the status transition under the attendant responsible.
     */
    public BookingSummaryDTO confirmBooking(Long bookingId, Long attendantId) {
        Booking entity = bookingRepository.findById(bookingId)
                .orElseThrow(() -> new ResourceNotFoundException("Booking not found with ID: " + bookingId));

        changeStatus(entity, BookingStatus.CONFIRMED, attendantId, "Booking confirmed");

        return bookingMapper.toSummary(entity);
    }

    @Transactional
    @CacheEvict(value = {"bookings", "booking-details"}, allEntries = true)
    /**
     * Updates mutable booking data only while its current status permits modification.
     * Tour, participant and discount changes recalculate both the financial snapshot and the 20% deposit.
     */
    public BookingSummaryDTO updateBooking(Long bookingId, UpdateBookingRequest request) {
        log.info("Starting update process for Booking ID: {}", bookingId);
        log.debug("Update request payload for Booking ID {}: {}", bookingId, request);

        Booking entity = bookingRepository.findById(bookingId)
                .orElseThrow(() -> new ResourceNotFoundException("Booking not found with ID: " + bookingId));

        entity.validateBookingStateForModification();
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

        Tour newTour = tourService.findById(newTourId);

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

    private BookingStatus getStatus(String pixPaymentUrl) {
        BookingStatus status = StringUtils.hasText(pixPaymentUrl) ? BookingStatus.CONFIRMED : BookingStatus.DRAFT;
        log.debug("Booking status evaluated to: {} (Has Pix URL: {})", status, StringUtils.hasText(pixPaymentUrl));

        return status;
    }
}

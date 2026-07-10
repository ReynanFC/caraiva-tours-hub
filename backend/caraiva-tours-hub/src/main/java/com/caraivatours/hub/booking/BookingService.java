package com.caraivatours.hub.booking;

import com.caraivatours.hub.booking.dto.request.CreateBookingRequest;
import com.caraivatours.hub.booking.dto.response.BookingDetailDTO;
import com.caraivatours.hub.booking.dto.response.BookingSummaryDTO;
import com.caraivatours.hub.booking.enums.BookingStatus;
import com.caraivatours.hub.booking.event.BookingStatusChangedEvent;
import com.caraivatours.hub.client.Client;
import com.caraivatours.hub.client.ClientService;
import com.caraivatours.hub.groupmember.GroupMember;
import com.caraivatours.hub.groupmember.dto.GroupMemberDTO;
import com.caraivatours.hub.payment.Payment;
import com.caraivatours.hub.pickuplocation.PickupLocation;
import com.caraivatours.hub.pickuplocation.dto.PickupDTO;
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
import java.math.RoundingMode;
import java.util.Set;
import java.util.stream.Collectors;

@Slf4j
@Service
@RequiredArgsConstructor
public class BookingService {

    private final BookingRepository bookingRepository;
    private final TourRepository tourRepository;
    private final BookingMapper bookingMapper;
    private final UserRepository userRepository;
    private final ApplicationEventPublisher eventPublisher;
    private final ClientService clientService;

    @Transactional(readOnly = true)
    public Page<BookingSummaryDTO> findAll(String search, Pageable pageable) {
        log.info("Fetching all bookings with search filter: '{}'", search);
        return bookingRepository.findAll(search, pageable);
    }

    @Transactional(readOnly = true)
    public Page<BookingSummaryDTO> findByStatus(BookingStatus status, Pageable pageable) {
        log.info("Filtering bookings by status: {}", status);
        return bookingRepository.findByCurrentStatus(status, pageable);
    }

    @Transactional(readOnly = true)
    public BookingDetailDTO findDetailsBooking(Long id) {
        log.info("Retrieving booking details with id: {}", id);

        Booking entity = bookingRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Booking not found with id: " + id));

        return bookingMapper.toDetail(entity);
    }

    @Transactional
    public BookingSummaryDTO createBooking(Long attendantId, CreateBookingRequest req) {
        log.info("Starting booking creation process for Tour ID: {} by Attendant ID: {}", req.tourId(), attendantId);
        log.debug("Received create booking payload: {}", req);

        User user = userRepository.findById(attendantId)
                .orElseThrow(() -> new ResourceNotFoundException("User not found with ID: " + attendantId));

        Tour tour = tourRepository.findById(req.tourId())
                .orElseThrow(() -> new ResourceNotFoundException("Tour not found with ID: " + req.tourId()));

        Client client = clientService.findOrCreate(req.client());
        log.debug("Client resolved/created successfully: {}", client.getId());

        PickupLocation pickup = createPickupLocation(req.pickup());
        Set<GroupMember> members = addMembersInBooking(req.members());
        BookingStatus status = getStatus(req.pixPaymentUrl());

        Booking entity = Booking.builder()
                .attendant(user)
                .client(client)
                .tour(tour)
                .pickupLocation(pickup)
                .customSchedule(req.scheduleDate())
                .groupMembers(members)
                .currentStatus(status)
                .build();

        int totalParticipants = Booking.calculateTotalParticipants(members.size());
        entity.updateFinancials(tour.getEffectivePrice(), totalParticipants, req.manualDiscount());
        log.debug("Booking financials updated. Total participants: {}, Manual discount: {}", totalParticipants, req.manualDiscount());

        if (StringUtils.hasText(req.pixPaymentUrl())) {
            log.info("Creating reservation payment with URL: {}", req.pixPaymentUrl());
            createPayment(req.pixPaymentUrl(), entity);
        }

        var savedBooking = bookingRepository.save(entity);
        log.info("Booking created successfully. Generated ID: {}, Initial Status: {}", savedBooking.getId(), status);

        eventPublisher.publishEvent(new BookingStatusChangedEvent(
                savedBooking.getId(), null, status, attendantId, "Created booking"
        ));

        return bookingMapper.toSummary(entity);
    }

    @Transactional
    public BookingSummaryDTO confirmBooking(Long bookingId, Long attendantId) {
        Booking entity = bookingRepository.findById(bookingId)
                .orElseThrow(() -> new ResourceNotFoundException("Booking not found with ID: " + bookingId));

        changeStatus(entity, BookingStatus.CONFIRMED, attendantId, "Booking confirmed");

        return bookingMapper.toSummary(entity);
    }

    private void createPayment(String pixPaymentUrl, Booking booking) {
        BigDecimal signalAmount = booking.getFinancialData()
                .totalPrice()
                .multiply(BigDecimal.valueOf(0.20))
                .setScale(2, RoundingMode.HALF_EVEN);

        booking.setPayment(new Payment(signalAmount, pixPaymentUrl, booking));
    }

    private void changeStatus(Booking booking, BookingStatus newStatus, Long userId, String reason) {
        var previousStatus = booking.getCurrentStatus();
        booking.setCurrentStatus(newStatus);
        bookingRepository.save(booking);

        eventPublisher.publishEvent(new BookingStatusChangedEvent(
                booking.getId(), previousStatus, newStatus, userId, reason
        ));
    }

    private Set<GroupMember> addMembersInBooking(Set<GroupMemberDTO> dto) {

        log.debug("Mapping {} group members to booking entities", dto.size());
        return dto.stream()
                .map(this::createGroupMember)
                .collect(Collectors.toSet());
    }

    private GroupMember createGroupMember(GroupMemberDTO dto) {
        return new GroupMember(dto.name(), dto.isLapChild());
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

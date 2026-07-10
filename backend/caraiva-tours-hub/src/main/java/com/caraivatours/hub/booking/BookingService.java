package com.caraivatours.hub.booking;

import com.caraivatours.hub.booking.dto.request.CreateBookingRequest;
import com.caraivatours.hub.booking.dto.response.BookingSummaryDTO;
import com.caraivatours.hub.booking.enums.BookingStatus;
import com.caraivatours.hub.client.Client;
import com.caraivatours.hub.client.ClientService;
import com.caraivatours.hub.groupmember.GroupMember;
import com.caraivatours.hub.groupmember.dto.GroupMemberDTO;
import com.caraivatours.hub.pickuplocation.PickupLocation;
import com.caraivatours.hub.pickuplocation.dto.PickupDTO;
import com.caraivatours.hub.shared.exceptions.ResourceNotFoundException;
import com.caraivatours.hub.tour.TourRepository;
import com.caraivatours.hub.tour.entity.Tour;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.util.StringUtils;

import java.util.Set;
import java.util.stream.Collectors;

@Slf4j
@Service
@RequiredArgsConstructor
public class BookingService {

    private final BookingRepository bookingRepository;
    private final TourRepository tourRepository;
    private final BookingMapper bookingMapper;
    private final ClientService clientService;

    @Transactional
    public BookingSummaryDTO createBooking(CreateBookingRequest req) {

        log.info("Starting booking creation process for Tour ID: {}", req.tourId());
        log.debug("Received create booking payload: {}", req);

        Tour tour = tourRepository.findById(req.tourId())
                .orElseThrow(() -> new ResourceNotFoundException("Tour not found with ID: " + req.tourId()));

        Client client = clientService.findOrCreate(req.client());
        log.debug("Client resolved/created successfully: {}", client.getId());

        PickupLocation pickup = createPickupLocation(req.pickup());
        Set<GroupMember> members = addMembersInBooking(req.members());
        BookingStatus status = getStatus(req.pixPaymentUrl());

        Booking booking = Booking.builder()
                .client(client)
                .tour(tour)
                .pickupLocation(pickup)
                .customSchedule(req.scheduleDate())
                .groupMembers(members)
                .currentStatus(status)
                .build();

        int totalParticipants = Booking.calculateTotalParticipants(members.size());
        booking.updateFinancials(tour.getEffectivePrice(), totalParticipants, req.manualDiscount());
        log.debug("Booking financials updated. Total participants: {}, Manual discount: {}", totalParticipants, req.manualDiscount());

        var savedBooking = bookingRepository.save(booking);
        log.info("Booking created successfully. Generated ID: {}, Initial Status: {}", savedBooking.getId(), status);

        return bookingMapper.toSummary(booking);
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

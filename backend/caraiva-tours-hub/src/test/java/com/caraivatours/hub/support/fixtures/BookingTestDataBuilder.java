package com.caraivatours.hub.support.fixtures;

import com.caraivatours.hub.booking.Booking;
import com.caraivatours.hub.booking.embeddable.FinancialSnapshot;
import com.caraivatours.hub.booking.enums.BookingStatus;
import com.caraivatours.hub.booking.statushistory.StatusHistory;
import com.caraivatours.hub.client.Client;
import com.caraivatours.hub.groupmember.GroupMember;
import com.caraivatours.hub.payment.Payment;
import com.caraivatours.hub.pickuplocation.PickupLocation;
import com.caraivatours.hub.tour.entity.Tour;
import com.caraivatours.hub.user.User;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

import static com.caraivatours.hub.support.fixtures.ClientTestDataBuilder.aClient;
import static com.caraivatours.hub.support.fixtures.FinancialSnapshotTestDataBuilder.aFinancialSnapshot;
import static com.caraivatours.hub.support.fixtures.PickupLocationTestDataBuilder.aPickupLocation;
import static com.caraivatours.hub.support.fixtures.TourTestDataBuilder.aTour;
import static com.caraivatours.hub.support.fixtures.UserTestDataBuilder.aUser;

public final class BookingTestDataBuilder {

    private Long id;
    private LocalDateTime customSchedule = LocalDateTime.of(2026, 2, 15, 8, 0);
    private FinancialSnapshot financialData = aFinancialSnapshot().build();
    private BookingStatus currentStatus = BookingStatus.DRAFT;
    private LocalDateTime createdAt = LocalDateTime.of(2026, 1, 10, 11, 0);
    private LocalDateTime updatedAt = LocalDateTime.of(2026, 1, 10, 11, 0);
    private Tour tour = aTour().build();
    private Client client = aClient().build();
    private User attendant = aUser().build();
    private PickupLocation pickupLocation = aPickupLocation().build();
    private final List<GroupMember> groupMembers = new ArrayList<>();
    private Payment payment;
    private final List<StatusHistory> statusHistory = new ArrayList<>();

    private BookingTestDataBuilder() {
    }

    public static BookingTestDataBuilder aBooking() {
        return new BookingTestDataBuilder();
    }

    public Booking build() {
        Booking booking = Booking.builder()
                .id(id)
                .customSchedule(customSchedule)
                .financialData(financialData)
                .currentStatus(currentStatus)
                .createdAt(createdAt)
                .updatedAt(updatedAt)
                .tour(tour)
                .client(client)
                .attendant(attendant)
                .pickupLocation(pickupLocation)
                .payment(payment)
                .build();

        groupMembers.forEach(booking::addGroupMember);
        statusHistory.forEach(booking::addStatusHistory);

        if (payment != null) {
            payment.setBooking(booking);
        }

        return booking;
    }
}

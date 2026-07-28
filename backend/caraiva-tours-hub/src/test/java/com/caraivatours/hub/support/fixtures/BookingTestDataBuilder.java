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
import java.util.LinkedHashSet;
import java.util.Set;

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
    private final Set<GroupMember> groupMembers = new LinkedHashSet<>();
    private Payment payment;
    private final Set<StatusHistory> statusHistory = new LinkedHashSet<>();

    private BookingTestDataBuilder() {
    }

    public static BookingTestDataBuilder aBooking() {
        return new BookingTestDataBuilder();
    }

    public BookingTestDataBuilder withId(Long id) {
        this.id = id;
        return this;
    }

    public BookingTestDataBuilder withCustomSchedule(LocalDateTime customSchedule) {
        this.customSchedule = customSchedule;
        return this;
    }

    public BookingTestDataBuilder withFinancialData(FinancialSnapshot financialData) {
        this.financialData = financialData;
        return this;
    }

    public BookingTestDataBuilder withStatus(BookingStatus currentStatus) {
        this.currentStatus = currentStatus;
        return this;
    }

    public BookingTestDataBuilder withCreatedAt(LocalDateTime createdAt) {
        this.createdAt = createdAt;
        return this;
    }

    public BookingTestDataBuilder withUpdatedAt(LocalDateTime updatedAt) {
        this.updatedAt = updatedAt;
        return this;
    }

    public BookingTestDataBuilder withTour(Tour tour) {
        this.tour = tour;
        return this;
    }

    public BookingTestDataBuilder withClient(Client client) {
        this.client = client;
        return this;
    }

    public BookingTestDataBuilder withAttendant(User attendant) {
        this.attendant = attendant;
        return this;
    }

    public BookingTestDataBuilder withPickupLocation(PickupLocation pickupLocation) {
        this.pickupLocation = pickupLocation;
        return this;
    }

    public BookingTestDataBuilder withGroupMember(GroupMember groupMember) {
        this.groupMembers.add(groupMember);
        return this;
    }

    public BookingTestDataBuilder withGroupMembers(Set<GroupMember> groupMembers) {
        this.groupMembers.clear();
        this.groupMembers.addAll(groupMembers);
        return this;
    }

    public BookingTestDataBuilder withPayment(Payment payment) {
        this.payment = payment;
        return this;
    }

    public BookingTestDataBuilder withStatusHistory(StatusHistory history) {
        this.statusHistory.add(history);
        return this;
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

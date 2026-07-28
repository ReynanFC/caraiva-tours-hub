package com.caraivatours.hub.support.fixtures;

import com.caraivatours.hub.booking.Booking;
import com.caraivatours.hub.booking.enums.BookingStatus;
import com.caraivatours.hub.booking.statushistory.StatusHistory;
import com.caraivatours.hub.user.User;

import java.time.LocalDateTime;

import static com.caraivatours.hub.support.fixtures.UserTestDataBuilder.aUser;

public final class StatusHistoryTestDataBuilder {

    private Long id;
    private BookingStatus previousStatus = BookingStatus.DRAFT;
    private BookingStatus newStatus = BookingStatus.CONFIRMED;
    private String changeReason = "Pagamento confirmado.";
    private LocalDateTime changedAt = LocalDateTime.of(2026, 1, 10, 12, 30);
    private Booking booking;
    private User user = aUser().build();

    private StatusHistoryTestDataBuilder() {
    }

    public static StatusHistoryTestDataBuilder aStatusHistory() {
        return new StatusHistoryTestDataBuilder();
    }

    public StatusHistoryTestDataBuilder withId(Long id) {
        this.id = id;
        return this;
    }

    public StatusHistoryTestDataBuilder withPreviousStatus(BookingStatus previousStatus) {
        this.previousStatus = previousStatus;
        return this;
    }

    public StatusHistoryTestDataBuilder withNewStatus(BookingStatus newStatus) {
        this.newStatus = newStatus;
        return this;
    }

    public StatusHistoryTestDataBuilder withChangeReason(String changeReason) {
        this.changeReason = changeReason;
        return this;
    }

    public StatusHistoryTestDataBuilder withChangedAt(LocalDateTime changedAt) {
        this.changedAt = changedAt;
        return this;
    }

    public StatusHistoryTestDataBuilder withBooking(Booking booking) {
        this.booking = booking;
        return this;
    }

    public StatusHistoryTestDataBuilder withUser(User user) {
        this.user = user;
        return this;
    }

    public StatusHistory build() {
        StatusHistory history = new StatusHistory();
        history.setId(id);
        history.setPreviousStatus(previousStatus);
        history.setNewStatus(newStatus);
        history.setChangeReason(changeReason);
        history.setChangedAt(changedAt);
        history.setBooking(booking);
        history.setUser(user);
        return history;
    }
}

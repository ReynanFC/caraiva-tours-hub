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

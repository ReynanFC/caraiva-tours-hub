package com.caraivatours.hub.booking.event;

import com.caraivatours.hub.booking.enums.BookingStatus;

public record BookingStatusChangedEvent(
        Long bookingId,
        BookingStatus previousStatus,
        BookingStatus newStatus,
        Long changedByUserId,
        String reason
) {}

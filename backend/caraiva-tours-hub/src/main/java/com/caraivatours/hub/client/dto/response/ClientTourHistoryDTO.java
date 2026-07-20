package com.caraivatours.hub.client.dto.response;

import com.caraivatours.hub.booking.enums.BookingStatus;

import java.math.BigDecimal;
import java.time.LocalDateTime;

public record ClientTourHistoryDTO(
        Long bookingId,
        String tourName,
        LocalDateTime scheduledAt,
        int groupSize,
        BigDecimal totalPrice,
        BookingStatus status
) {
}

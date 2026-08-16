package com.caraivatours.hub.refundrequest.dto.response;

import com.caraivatours.hub.booking.enums.BookingStatus;

import java.time.LocalDateTime;

public record RefundBookingOptionDTO(
        Long id,
        String clientName,
        String tourName,
        LocalDateTime schedule,
        BookingStatus status
) {
}

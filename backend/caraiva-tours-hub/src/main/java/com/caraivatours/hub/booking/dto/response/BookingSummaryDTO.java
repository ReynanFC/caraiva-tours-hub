package com.caraivatours.hub.booking.dto.response;

import com.caraivatours.hub.booking.enums.BookingStatus;

import java.math.BigDecimal;
import java.time.LocalDateTime;

public record BookingSummaryDTO(
        Long id,
        Long attendantId,
        String clientName,
        String tourName,
        LocalDateTime date,
        int groupSize,
        BigDecimal totalPrice,
        BookingStatus status
) {}

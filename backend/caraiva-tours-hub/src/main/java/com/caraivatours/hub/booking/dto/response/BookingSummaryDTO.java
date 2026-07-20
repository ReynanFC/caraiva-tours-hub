package com.caraivatours.hub.booking.dto.response;

import com.caraivatours.hub.booking.enums.BookingStatus;
import io.swagger.v3.oas.annotations.media.Schema;

import java.math.BigDecimal;
import java.time.LocalDateTime;

public record BookingSummaryDTO(
        Long id,
        @Schema(description = "Identifier of the client who made the booking", example = "42")
        Long clientId,
        String clientName,
        String tourName,
        LocalDateTime date,
        int groupSize,
        BigDecimal totalPrice,
        BookingStatus status
) {}

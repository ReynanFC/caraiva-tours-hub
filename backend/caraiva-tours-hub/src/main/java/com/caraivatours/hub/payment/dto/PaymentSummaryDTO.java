package com.caraivatours.hub.payment.dto;

import com.caraivatours.hub.booking.enums.BookingStatus;

import java.math.BigDecimal;
import java.time.LocalDateTime;

public record PaymentSummaryDTO(
        Long paymentId,
        String clientName,
        String tourName,
        LocalDateTime scheduledAt,
        BigDecimal signalAmount,
        BigDecimal totalPrice
) {}

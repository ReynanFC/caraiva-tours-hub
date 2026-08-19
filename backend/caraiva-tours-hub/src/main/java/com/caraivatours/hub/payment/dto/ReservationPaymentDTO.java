package com.caraivatours.hub.payment.dto;

import com.caraivatours.hub.booking.enums.BookingStatus;
import java.math.BigDecimal;
import java.time.LocalDateTime;

public record ReservationPaymentDTO(
        Long bookingId,
        Long paymentId,
        String clientName,
        String tourName,
        LocalDateTime scheduledAt,
        BookingStatus status,
        BigDecimal signalAmount,
        BigDecimal totalPrice
) {}

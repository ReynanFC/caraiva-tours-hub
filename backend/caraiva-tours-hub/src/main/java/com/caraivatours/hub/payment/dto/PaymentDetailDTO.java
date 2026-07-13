package com.caraivatours.hub.payment.dto;

import com.caraivatours.hub.booking.statushistory.dto.StatusHistoryDTO;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;

public record PaymentDetailDTO(
        Long paymentId,
        String clientName,
        String tourName,
        BigDecimal totalPrice,
        BigDecimal signalAmount,
        BigDecimal presentialAmount,
        String receiptUrl,
        LocalDateTime paidAt,
        List<StatusHistoryDTO> history
) {}

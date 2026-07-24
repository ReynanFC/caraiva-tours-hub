package com.caraivatours.hub.payment.dto;

import java.math.BigDecimal;

public record PaymentOverviewDTO(
        BigDecimal receivedDepositAmount,
        BigDecimal awaitingReceiptAmount,
        BigDecimal remainingAmount
) {}

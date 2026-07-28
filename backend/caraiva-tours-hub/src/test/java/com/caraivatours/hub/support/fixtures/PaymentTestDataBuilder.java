package com.caraivatours.hub.support.fixtures;

import com.caraivatours.hub.booking.Booking;
import com.caraivatours.hub.payment.Payment;

import java.math.BigDecimal;
import java.time.LocalDateTime;

public final class PaymentTestDataBuilder {

    private Long id;
    private BigDecimal expectedAmount = new BigDecimal("106.00");
    private String receiptUrl = "https://example.com/receipts/payment-001.pdf";
    private LocalDateTime paidAt = LocalDateTime.of(2026, 1, 10, 12, 0);
    private Booking booking;

    private PaymentTestDataBuilder() {
    }

    public static PaymentTestDataBuilder aPayment() {
        return new PaymentTestDataBuilder();
    }

    public Payment build() {
        Payment payment = new Payment(expectedAmount, receiptUrl, booking);
        payment.setId(id);
        payment.setPaidAt(paidAt);

        if (booking != null) {
            booking.setPayment(payment);
        }

        return payment;
    }
}

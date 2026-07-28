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

    public PaymentTestDataBuilder withId(Long id) {
        this.id = id;
        return this;
    }

    public PaymentTestDataBuilder withExpectedAmount(BigDecimal expectedAmount) {
        this.expectedAmount = expectedAmount;
        return this;
    }

    public PaymentTestDataBuilder withReceiptUrl(String receiptUrl) {
        this.receiptUrl = receiptUrl;
        return this;
    }

    public PaymentTestDataBuilder withPaidAt(LocalDateTime paidAt) {
        this.paidAt = paidAt;
        return this;
    }

    public PaymentTestDataBuilder withBooking(Booking booking) {
        this.booking = booking;
        return this;
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

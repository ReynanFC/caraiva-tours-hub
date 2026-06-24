package com.caraivatours.hub.payment;

import com.caraivatours.hub.booking.Booking;
import jakarta.persistence.*;
import org.hibernate.annotations.CreationTimestamp;

import java.io.Serial;
import java.io.Serializable;
import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.Objects;

@Entity
@Table(name="payment")
public class Payment implements Serializable {

    @Serial
    private static final long serialVersionUID = 1L;

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name="payment_id")
    private Long id;

    @Column(name="amount_paid",  nullable=false, precision=10,scale=2)
    private BigDecimal amountPaid;

    @Column(name="external_receipt_url", nullable = false)
    private String externalReceiptUrl;

    @CreationTimestamp
    @Column(name="paid_at", nullable = false)
    private LocalDateTime paidAt;

    @OneToOne(mappedBy = "payment")
    private Booking booking;

    public Payment() {}

    public Payment(BigDecimal amountPaid, String externalReceiptUrl, Booking booking) {
        this.amountPaid = amountPaid;
        this.externalReceiptUrl = externalReceiptUrl;
        this.booking = booking;
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public BigDecimal getAmountPaid() {
        return amountPaid;
    }

    public void setAmountPaid(BigDecimal amountPaid) {
        this.amountPaid = amountPaid;
    }

    public String getExternalReceiptUrl() {
        return externalReceiptUrl;
    }

    public void setExternalReceiptUrl(String externalReceiptUrl) {
        this.externalReceiptUrl = externalReceiptUrl;
    }

    public LocalDateTime getPaidAt() {
        return paidAt;
    }

    public void setPaidAt(LocalDateTime paidAt) {
        this.paidAt = paidAt;
    }

    public Booking getBooking() {
        return booking;
    }

    public void setBooking(Booking booking) {
        this.booking = booking;
    }

    @Override
    public boolean equals(Object o) {
        if (o == null || getClass() != o.getClass()) return false;
        Payment payment = (Payment) o;
        return Objects.equals(id, payment.id);
    }

    @Override
    public int hashCode() {
        return Objects.hashCode(id);
    }
}

package com.caraivatours.hub.payment;

import com.caraivatours.hub.booking.Booking;
import jakarta.persistence.*;
import lombok.EqualsAndHashCode;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import org.hibernate.annotations.CreationTimestamp;

import java.io.Serial;
import java.io.Serializable;
import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.Objects;

@Entity
@Getter
@Setter
@EqualsAndHashCode(onlyExplicitlyIncluded = true)
@NoArgsConstructor
@Table(name="payment")
public class Payment implements Serializable {

    @Serial
    private static final long serialVersionUID = 1L;

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name="payment_id")
    @EqualsAndHashCode.Include
    private Long id;

    @Column(name="expected_amount",  nullable=false, precision=10,scale=2)
    private BigDecimal expectedAmount;

    @Column(name="receipt_url", nullable = false)
    private String receiptUrl;

    @CreationTimestamp
    @Column(name="paid_at", nullable = false)
    private LocalDateTime paidAt;

    @OneToOne(mappedBy = "payment")
    private Booking booking;

    public Payment(BigDecimal expectedAmount, String receiptUrl, Booking booking) {
        this.expectedAmount = expectedAmount;
        this.receiptUrl = receiptUrl;
        this.booking = booking;
    }
}

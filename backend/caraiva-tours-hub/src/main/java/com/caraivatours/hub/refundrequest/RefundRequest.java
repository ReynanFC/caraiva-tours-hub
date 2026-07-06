package com.caraivatours.hub.refundrequest;

import com.caraivatours.hub.booking.Booking;
import jakarta.persistence.*;
import lombok.EqualsAndHashCode;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.JdbcTypeCode;
import org.hibernate.type.SqlTypes;
import com.caraivatours.hub.user.User;

import java.io.Serial;
import java.io.Serializable;
import java.time.LocalDateTime;

@Entity
@Getter
@Setter
@NoArgsConstructor
@EqualsAndHashCode(onlyExplicitlyIncluded = true)
@Table(name="RefundRequest")
public class RefundRequest implements Serializable {

    @Serial
    private static final long serialVersionUID = 1L;

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "refund_id")
    @EqualsAndHashCode.Include
    private Long id;

    @Column(name = "reason", nullable = false, length = 255)
    private String reason;

    @Column(name = "admin_observation", length = 255)
    private String adminObservation;

    @Enumerated(EnumType.STRING)
    @JdbcTypeCode(SqlTypes.NAMED_ENUM)
    @Column(name = "refund_status", nullable = false)
    private RefundStatus refundStatus = RefundStatus.PENDING;

    @CreationTimestamp
    @Column(name = "requested_at", nullable = false, updatable = false)
    private LocalDateTime requestedAt;

    @Column(name = "resolved_at")
    private LocalDateTime resolvedAt;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "booking_id", nullable = false)
    private Booking booking;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "requested_by_user_id", nullable = false)
    private User requestedByUser;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "resolved_by_user_id")
    private User resolvedByUser;

    public RefundRequest(
            String reason,
            Booking booking,
            User requestedByUser
    ) {
        this.reason = reason;
        this.booking = booking;
        this.requestedByUser = requestedByUser;
    }

    public void resolve(
            RefundStatus refundStatus,
            String adminObservation,
            User resolvedByUser
    ) {
        this.refundStatus = refundStatus;
        this.adminObservation = adminObservation;
        this.resolvedByUser = resolvedByUser;
        this.resolvedAt = LocalDateTime.now();
    }

}

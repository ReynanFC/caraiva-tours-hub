package entities;

import entities.enums.BookingStatus;
import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.JdbcTypeCode;
import org.hibernate.type.SqlTypes;

import java.io.Serial;
import java.io.Serializable;
import java.math.BigDecimal;
import java.time.LocalDateTime;

@Entity
@Table(name="booking")
@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
@EqualsAndHashCode(onlyExplicitlyIncluded = true)
public class Booking implements Serializable {

    @Serial
    private static final long serialVersionUID = 1L;

    @Id
    @GeneratedValue(strategy= GenerationType.IDENTITY)
    @Column(name="booking_id")
    @EqualsAndHashCode.Include
    private Long id;

    @Column(name="custom_schedule",  nullable=false)
    private LocalDateTime customSchedule;

    @Column(name="manual_discount", precision = 10, scale = 2)
    private BigDecimal manualDiscount = BigDecimal.ZERO;

    @Column(name="total_price_snapshot", precision = 10, scale = 2, nullable = false)
    private BigDecimal totalPriceSnapshot;

    @Column(name="unit_price_snapshot", precision = 10, scale = 2, nullable = false)
    private BigDecimal unitPriceSnapShot;

    @Enumerated(EnumType.STRING)
    @JdbcTypeCode(SqlTypes.NAMED_ENUM)
    @Column(name="current_status",  nullable=false)
    private BookingStatus currentStatus = BookingStatus.PENDING_RECEIPT; // default

    @CreationTimestamp
    @Column(name="created_at", nullable=false)
    private LocalDateTime createdAt;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name= "tour_id", nullable=false)
    private Tour tour;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name= "client_id", nullable=false)
    private Client client;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name= "user_id", nullable=false)
    private User attendant;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name= "pickup_id", nullable=false)
    private PickupLocation pickupLocation;
    // groupmembers, payments and status histories

    public BigDecimal calculateTotalPrice() {return null;}
    public BigDecimal calculateRequiredDeposit(){return null;}
    public BigDecimal getRemainingBalance(){return null;}
    public void addGroupMember(GroupMember member) {

    }
}

package entities;

import entities.embeddable.FinancialSnapshot;
import entities.enums.BookingStatus;
import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.JdbcTypeCode;
import org.hibernate.type.SqlTypes;

import java.io.Serial;
import java.io.Serializable;
import java.math.BigDecimal;
import java.math.RoundingMode;
import java.time.LocalDateTime;
import java.util.HashSet;
import java.util.Set;

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

    private static final String DEPOSIT_PERCENTAGE = "0.20";
    private static final int ORGANIZER_COUNT = 1;

    @Id
    @GeneratedValue(strategy= GenerationType.IDENTITY)
    @Column(name="booking_id")
    @EqualsAndHashCode.Include
    private Long id;

    @Column(name="custom_schedule",  nullable=false)
    private LocalDateTime customSchedule;

    @Embedded
    private FinancialSnapshot financialData;

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

    @Setter(AccessLevel.NONE)
    @OneToMany(mappedBy = "booking")
    private Set<GroupMember> groupMembers = new HashSet<>();

    @OneToOne(fetch = FetchType.LAZY, cascade = CascadeType.ALL)
    @JoinColumn(name = "payment_id")
    private Payment payment;

    @Setter(AccessLevel.NONE)
    @OneToMany(mappedBy = "booking", cascade = CascadeType.PERSIST)
    private Set<StatusHistory> statusHistory = new HashSet<>();

    public BigDecimal calculateTotalPrice() {
        BigDecimal baseTotal = financialData.totalPrice().subtract(financialData.manualDiscount());

        if (!pickupLocation.getAppliedPickupFee().equals(BigDecimal.ZERO)) {
            return baseTotal.add(pickupLocation.getAppliedPickupFee());
        }

        return baseTotal;
    }

    public BigDecimal calculateRequiredDeposit() {
        return calculateTotalPrice().multiply(new BigDecimal(DEPOSIT_PERCENTAGE))
                .setScale(2, RoundingMode.HALF_UP);
    }

    public void updateFinancials(BigDecimal unitPrice, int participants, BigDecimal discount) {
        BigDecimal total = unitPrice.multiply(BigDecimal.valueOf(participants));
        BigDecimal commissionPerPerson = tour.calculateCommissionPerPerson(unitPrice);

        BigDecimal totalCommission = commissionPerPerson.multiply(BigDecimal.valueOf(participants))
                .setScale(2, RoundingMode.HALF_UP);

        financialData = new FinancialSnapshot(unitPrice, total, totalCommission, discount);
    }

    public static int calculateTotalParticipants(int membersCount) {
        return membersCount + ORGANIZER_COUNT;
    }

    public void addGroupMember(GroupMember member) {
        this.groupMembers.add(member);
        member.setBooking(this);
    }

    public void removeGroupMember(GroupMember member) {
        this.groupMembers.remove(member);
        member.setBooking(null);
    }

    public void addStatusHistory(StatusHistory status) {
        statusHistory.add(status);
        status.setBooking(this);
    }

}

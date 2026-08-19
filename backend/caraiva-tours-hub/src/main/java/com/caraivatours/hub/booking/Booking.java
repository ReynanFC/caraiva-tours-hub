package com.caraivatours.hub.booking;

import com.caraivatours.hub.client.Client;
import com.caraivatours.hub.groupmember.GroupMember;
import com.caraivatours.hub.payment.Payment;
import com.caraivatours.hub.booking.embeddable.FinancialSnapshot;
import com.caraivatours.hub.shared.exceptions.BadRequestException;
import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.JdbcTypeCode;
import org.hibernate.annotations.UpdateTimestamp;
import org.hibernate.type.SqlTypes;
import com.caraivatours.hub.pickuplocation.PickupLocation;
import com.caraivatours.hub.booking.enums.BookingStatus;
import com.caraivatours.hub.booking.statushistory.StatusHistory;
import com.caraivatours.hub.tour.entity.Tour;
import com.caraivatours.hub.user.User;

import java.io.Serial;
import java.io.Serializable;
import java.math.BigDecimal;
import java.math.RoundingMode;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

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
    private BookingStatus currentStatus;

    @CreationTimestamp
    @Column(name="created_at", nullable=false)
    private LocalDateTime createdAt;

    @UpdateTimestamp
    @Column(name="updated_at")
    private LocalDateTime updatedAt;

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
    @Builder.Default
    @OneToMany(mappedBy = "booking", cascade = CascadeType.ALL, orphanRemoval = true)
    @OrderBy("id ASC")
    private List<GroupMember> groupMembers = new ArrayList<>();

    @OneToOne(fetch = FetchType.LAZY, cascade = CascadeType.PERSIST)
    @JoinColumn(name = "payment_id")
    private Payment payment;

    @Setter(AccessLevel.NONE)
    @Builder.Default
    @OneToMany(mappedBy = "booking", cascade = CascadeType.PERSIST)
    @OrderBy("changedAt ASC, id ASC")
    private List<StatusHistory> statusHistory = new ArrayList<>();


    /**
     * Calculates the final total price of the booking, including the base price,
     * deducting any manual discounts, and adding pickup location fees if applicable.
     *
     * @return a {@link BigDecimal} representing the final total price.
     */
    public BigDecimal calculateTotalPrice() {
        BigDecimal baseTotal = financialData.totalPrice().subtract(financialData.manualDiscount());

        if (!pickupLocation.getAppliedPickupFee().equals(BigDecimal.ZERO)) {
            return baseTotal.add(pickupLocation.getAppliedPickupFee());
        }

        return baseTotal;
    }

    /**
     * Calculates the required deposit amount for the booking based on the
     * defined deposit percentage configuration. The result is rounded to two decimal places.
     *
     * @return a {@link BigDecimal} representing the required deposit amount rounded half-up.
     */
    public BigDecimal calculateRequiredDeposit() {
        return calculateTotalPrice().multiply(new BigDecimal(DEPOSIT_PERCENTAGE))
                .setScale(2, RoundingMode.HALF_UP);
    }

    /**
     * Updates the financial snapshot of the booking. Calculates the total gross amount
     * and the total tour commission based on the number of participants, then instantiates
     * a new immutable {@link FinancialSnapshot}.
     *
     * @param unitPrice    the price per individual participant.
     * @param members      the group members; lap children do not pay.
     * @param discount     the manual discount amount to be applied.
     */
    public void updateFinancials(BigDecimal unitPrice, List<GroupMember> members, BigDecimal discount) {
        int participants = calculateTotalParticipants(members);
        BigDecimal total = unitPrice.multiply(BigDecimal.valueOf(participants));
        BigDecimal commissionPerPerson = tour.calculateCommissionPerPerson(unitPrice);

        BigDecimal totalCommission = commissionPerPerson.multiply(BigDecimal.valueOf(participants))
                .setScale(2, RoundingMode.HALF_UP);

        financialData = new FinancialSnapshot(unitPrice, total, totalCommission, discount);
    }

    /**
     * Calculates the total number of participants by adding the group members count
     * to the mandatory organizer count.
     *
     * @param members the registered group members.
     * @return the total headcount for the booking.
     */
    public static int calculateTotalParticipants(List<GroupMember> members) {
        long payingMembers = members.stream()
                .filter(member -> !member.isLapChild())
                .count();
        return Math.toIntExact(payingMembers) + ORGANIZER_COUNT;
    }

    public void validateBookingStateForModification() {
        if (currentStatus == BookingStatus.COMPLETED ||
            currentStatus == BookingStatus.CANCELLED ||
            currentStatus == BookingStatus.CANCEL_REQUEST) {
            throw new BadRequestException("This Booking cannot be changed/accessed because its status is: " + currentStatus.name());
        }
    }

    public void validateBookingStateForCancellation() {
        if (currentStatus != BookingStatus.DRAFT && currentStatus != BookingStatus.CONFIRMED) {
            throw new BadRequestException("Only a draft or confirmed booking can be cancelled");
        }
    }
// corrigir a duplicação de passeios confirmados
    public void addGroupMember(GroupMember member) {
        groupMembers.add(member);
        member.setBooking(this);
    }

    public void replaceGroupMembers(List<GroupMember> members) {
        groupMembers.clear();
        members.forEach(this::addGroupMember);
    }

    public void addStatusHistory(StatusHistory history) {
        statusHistory.add(history);
        history.setBooking(this);
    }
}

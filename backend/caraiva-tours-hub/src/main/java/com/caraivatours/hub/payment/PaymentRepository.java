package com.caraivatours.hub.payment;

import com.caraivatours.hub.booking.enums.BookingStatus;
import com.caraivatours.hub.booking.Booking;
import com.caraivatours.hub.payment.dto.PaymentSummaryDTO;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

@Repository
public interface PaymentRepository extends JpaRepository<Payment, Long> {

    @Query("""
    SELECT p FROM Payment p
        JOIN p.booking b
            WHERE (:idPayment IS NULL OR p.id = :idPayment)
                AND (:nameClient IS NULL OR LOWER(b.client.name) LIKE LOWER(CONCAT('%', :nameClient, '%')))
                    ORDER BY p.paidAt DESC
    """)
    Page<Payment> findAllByFilters(@Param("idPayment") Long idPayment,
                                   @Param("nameClient") String nameClient,
                                   Pageable pageable);

    @Query("""
    SELECT p FROM Payment p
        JOIN p.booking b
            WHERE b.currentStatus = :status
                ORDER BY p.paidAt DESC
    """)
    Page<Payment> findByStatusBooking(@Param("status") BookingStatus status, Pageable pageable);

    @Query("""
            SELECT b FROM Booking b
            WHERE (:status IS NULL OR b.currentStatus = :status)
              AND (:search = '' OR CAST(b.id AS string) LIKE CONCAT('%', :search, '%')
                   OR LOWER(b.client.name) LIKE LOWER(CONCAT('%', :search, '%'))
                   OR b.client.phone LIKE CONCAT('%', :search, '%'))
            ORDER BY b.createdAt DESC
            """)
    Page<Booking> findReservationsForPayment(@Param("status") BookingStatus status, @Param("search") String search, Pageable pageable);

    @Query("""
            SELECT COALESCE(SUM(CASE WHEN b.currentStatus IN :receivedStatuses THEN p.expectedAmount ELSE 0 END), 0) AS receivedDepositAmount,
                   COALESCE(SUM(CASE WHEN b.currentStatus = :draftStatus THEN b.financialData.totalPrice * 0.20 ELSE 0 END), 0) AS awaitingReceiptAmount,
                   COALESCE(SUM(CASE WHEN b.currentStatus = :approvedStatus THEN b.financialData.totalPrice * 0.80 ELSE 0 END), 0) AS remainingAmount
            FROM Booking b LEFT JOIN b.payment p
            """)
    PaymentOverviewProjection paymentOverview(@Param("receivedStatuses") java.util.List<BookingStatus> receivedStatuses,
                                              @Param("draftStatus") BookingStatus draftStatus,
                                              @Param("approvedStatus") BookingStatus approvedStatus);
}

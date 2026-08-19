package com.caraivatours.hub.payment;

import com.caraivatours.hub.booking.enums.BookingStatus;
import com.caraivatours.hub.booking.Booking;
import com.caraivatours.hub.payment.projection.PaymentOverviewProjection;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

@Repository
public interface PaymentRepository extends JpaRepository<Payment, Long> {

    /** Searches persisted payments by payment identifier and/or client phone. */
    @Query(value = """
            SELECT p.*
            FROM payment p
            JOIN booking b ON b.payment_id = p.payment_id
            JOIN client c ON c.client_id = b.client_id
            WHERE (:idPayment IS NULL OR p.payment_id = :idPayment)
              AND (:phoneClient IS NULL OR :phoneClient = ''
                   OR c.phone LIKE CONCAT('%', :phoneClient, '%'))
            ORDER BY p.paid_at DESC
            """,
            countQuery = """
            SELECT COUNT(*)
            FROM payment p
            JOIN booking b ON b.payment_id = p.payment_id
            JOIN client c ON c.client_id = b.client_id
            WHERE (:idPayment IS NULL OR p.payment_id = :idPayment)
              AND (:phoneClient IS NULL OR :phoneClient = ''
                   OR c.phone LIKE CONCAT('%', :phoneClient, '%'))
            """,
            nativeQuery = true)
    Page<Payment> findAllByFiltersQuery(
            @Param("idPayment") Long idPayment,
            @Param("phoneClient") String phoneClient,
            Pageable pageable
    );

    default Page<Payment> findAllByFilters(Long idPayment,
                                           String phoneClient,
                                           Pageable pageable) {
        return findAllByFiltersQuery(idPayment, phoneClient, withoutSort(pageable));
    }

    /** Returns payments linked to bookings in the requested workflow status. */
    @Query("""
    SELECT p FROM Payment p
        JOIN p.booking b
            WHERE b.currentStatus = :status
                ORDER BY p.paidAt DESC
    """)
    Page<Payment> findByStatusBooking(@Param("status") BookingStatus status, Pageable pageable);

    /** Searches bookings from the payment view, including DRAFT reservations that may not yet have a Payment entity. */
    @Query(value = """
            SELECT b.*
            FROM booking b
            JOIN client c ON c.client_id = b.client_id
            WHERE b.current_status = COALESCE(CAST(:status AS booking_status_enum), b.current_status)
              AND (:paymentId IS NULL AND (:phoneClient IS NULL OR :phoneClient = '')
                   OR b.payment_id = :paymentId
                   OR c.phone LIKE CONCAT('%', :phoneClient, '%'))
            ORDER BY b.created_at DESC
            """,
            countQuery = """
            SELECT COUNT(*)
            FROM booking b
            JOIN client c ON c.client_id = b.client_id
            WHERE b.current_status = COALESCE(CAST(:status AS booking_status_enum), b.current_status)
              AND (:paymentId IS NULL AND (:phoneClient IS NULL OR :phoneClient = '')
                   OR b.payment_id = :paymentId
                   OR c.phone LIKE CONCAT('%', :phoneClient, '%'))
            """,
            nativeQuery = true)
    Page<Booking> findReservationsForPaymentQuery(@Param("status") String status,
                                                  @Param("paymentId") Long paymentId,
                                                  @Param("phoneClient") String phoneClient,
                                                  Pageable pageable);

    default Page<Booking> findReservationsForPayment(BookingStatus status,
                                                     Long paymentId,
                                                     String phoneClient,
                                                     Pageable pageable) {
        String statusName = status == null ? null : status.name();
        return findReservationsForPaymentQuery(
                statusName,
                paymentId,
                phoneClient,
                withoutSort(pageable)
        );
    }

    private static Pageable withoutSort(Pageable pageable) {
        return pageable.isPaged()
                ? PageRequest.of(pageable.getPageNumber(), pageable.getPageSize())
                : pageable;
    }

    /** Aggregates received deposits, deposits awaiting proof and the 80% balance due. */
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

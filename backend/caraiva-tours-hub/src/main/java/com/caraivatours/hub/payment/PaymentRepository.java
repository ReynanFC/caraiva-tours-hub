package com.caraivatours.hub.payment;

import com.caraivatours.hub.booking.enums.BookingStatus;
import com.caraivatours.hub.booking.Booking;
import com.caraivatours.hub.payment.projection.PaymentOverviewProjection;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

@Repository
public interface PaymentRepository extends JpaRepository<Payment, Long> {

    /** Searches persisted payments by payment identifier and/or terms from the client name. */
    @Query(value = """
            SELECT p.*
            FROM payment p
            JOIN booking b ON b.payment_id = p.payment_id
            JOIN client c ON c.client_id = b.client_id
            WHERE (:idPayment IS NULL OR p.payment_id = :idPayment)
              AND (:nameClient IS NULL OR :nameClient = ''
                   OR to_tsvector('portuguese', COALESCE(c.name, ''))
                        @@ websearch_to_tsquery('portuguese', :nameClient))
            ORDER BY p.paid_at DESC
            """,
            countQuery = """
            SELECT COUNT(*)
            FROM payment p
            JOIN booking b ON b.payment_id = p.payment_id
            JOIN client c ON c.client_id = b.client_id
            WHERE (:idPayment IS NULL OR p.payment_id = :idPayment)
              AND (:nameClient IS NULL OR :nameClient = ''
                   OR to_tsvector('portuguese', COALESCE(c.name, ''))
                        @@ websearch_to_tsquery('portuguese', :nameClient))
            """,
            nativeQuery = true)
    Page<Payment> findAllByFilters(@Param("idPayment") Long idPayment,
                                   @Param("nameClient") String nameClient,
                                   Pageable pageable);

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
              AND (:search = ''
                   OR b.booking_id = CASE
                        WHEN :search ~ '^[0-9]+$' THEN CAST(:search AS BIGINT)
                        ELSE NULL
                      END
                   OR to_tsvector('portuguese', COALESCE(c.name, ''))
                        @@ websearch_to_tsquery('portuguese', :search)
                   OR c.phone LIKE CONCAT('%', :search, '%'))
            ORDER BY b.created_at DESC
            """,
            countQuery = """
            SELECT COUNT(*)
            FROM booking b
            JOIN client c ON c.client_id = b.client_id
            WHERE b.current_status = COALESCE(CAST(:status AS booking_status_enum), b.current_status)
              AND (:search = ''
                   OR b.booking_id = CASE
                        WHEN :search ~ '^[0-9]+$' THEN CAST(:search AS BIGINT)
                        ELSE NULL
                      END
                   OR to_tsvector('portuguese', COALESCE(c.name, ''))
                        @@ websearch_to_tsquery('portuguese', :search)
                   OR c.phone LIKE CONCAT('%', :search, '%'))
            """,
            nativeQuery = true)
    Page<Booking> findReservationsForPaymentQuery(@Param("status") String status,
                                                  @Param("search") String search,
                                                  Pageable pageable);

    default Page<Booking> findReservationsForPayment(BookingStatus status,
                                                     String search,
                                                     Pageable pageable) {
        String statusName = status == null ? null : status.name();
        return findReservationsForPaymentQuery(statusName, search, pageable);
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

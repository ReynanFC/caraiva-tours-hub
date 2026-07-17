package com.caraivatours.hub.payment;

import com.caraivatours.hub.booking.enums.BookingStatus;
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
}

package com.caraivatours.hub.refundrequest;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface RefundRequestRepository extends JpaRepository<RefundRequest, Long> {

    boolean existsByBookingIdAndRefundStatus(Long bookingId, RefundStatus refundStatus);
}

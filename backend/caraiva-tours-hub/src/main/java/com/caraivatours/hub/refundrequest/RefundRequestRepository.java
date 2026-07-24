package com.caraivatours.hub.refundrequest;

import com.caraivatours.hub.refundrequest.enums.RefundStatus;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface RefundRequestRepository extends JpaRepository<RefundRequest, Long> {

    boolean existsByBookingIdAndRefundStatus(Long bookingId, RefundStatus refundStatus);

    Page<RefundRequest> findAllByRequestedByUserId(Long requestedByUserId, Pageable pageable);
}

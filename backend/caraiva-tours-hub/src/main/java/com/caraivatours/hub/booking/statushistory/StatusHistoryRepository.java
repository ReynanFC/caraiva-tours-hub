package com.caraivatours.hub.booking.statushistory;

import com.caraivatours.hub.booking.enums.BookingStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface StatusHistoryRepository extends JpaRepository<StatusHistory, Long> {

    Optional<StatusHistory> findTopByBookingIdAndNewStatusOrderByIdDesc(
            Long bookingId,
            BookingStatus newStatus
    );
}

package com.caraivatours.hub.booking;

import com.caraivatours.hub.booking.dto.response.BookingSummaryDTO;
import com.caraivatours.hub.booking.enums.BookingStatus;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.security.core.parameters.P;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;

@Repository
public interface BookingRepository extends JpaRepository<Booking, Long> {

    @Query("SELECT b FROM Booking b WHERE b.currentStatus = :status AND b.customSchedule <= :threshold")
    List<Booking> findExpiredDrafts(@Param("status") BookingStatus status, @Param("threshold") LocalDateTime threshold);

    @Query("""
    SELECT new com.caraivatours.hub.booking.dto.response.BookingSummaryDTO(
        b.id,
        b.client.id,
        b.client.name,
        b.tour.name,
        b.customSchedule,
        (SIZE(b.groupMembers) + 1),
        b.financialData.totalPrice,
        b.currentStatus
    )
    FROM Booking b
    WHERE :search = ''
       OR LOWER(b.client.phone) LIKE LOWER(CONCAT('%', :search, '%'))
       OR LOWER(b.client.email) LIKE LOWER(CONCAT('%', :search, '%'))
""")
    Page<BookingSummaryDTO> findAll(@Param("search") String search, Pageable pageable);

    @Query("""
    SELECT new com.caraivatours.hub.booking.dto.response.BookingSummaryDTO(
        b.id,
        b.client.id,
        b.client.name,
        b.tour.name,
        b.customSchedule,
        (SIZE(b.groupMembers) + 1),
        b.financialData.totalPrice,
        b.currentStatus
    )
    FROM Booking b
    WHERE b.currentStatus = :status
""")
    Page<BookingSummaryDTO> findByCurrentStatus(@Param("status") BookingStatus status, Pageable pageable);
}

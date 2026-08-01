package com.caraivatours.hub.booking;

import com.caraivatours.hub.booking.dto.response.BookingSummaryDTO;
import com.caraivatours.hub.booking.enums.BookingStatus;
import com.caraivatours.hub.dashboard.projection.*;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;

@Repository
public interface BookingRepository extends JpaRepository<Booking, Long> {

    /** Finds DRAFT bookings whose scheduled time passed and can no longer remain pending. */
    @Query("SELECT b FROM Booking b WHERE b.currentStatus = :status AND b.customSchedule <= :threshold")
    List<Booking> findExpiredDrafts(@Param("status") BookingStatus status, @Param("threshold") LocalDateTime threshold);

    /** Searches booking summaries by client phone or email. */
    @Query("""
    SELECT new com.caraivatours.hub.booking.dto.response.BookingSummaryDTO(
        b.id,
        b.client.name,
        b.tour.name,
        b.customSchedule,
        (SIZE(b.groupMembers) + 1),
        b.financialData.totalPrice,
        b.currentStatus
    )
    FROM Booking b
    WHERE :search = ''
       OR b.client.phone LIKE CONCAT('%', :search, '%')
       OR LOWER(b.client.email) LIKE LOWER(CONCAT('%', :search, '%'))
""")
    Page<BookingSummaryDTO> findAll(@Param("search") String search, Pageable pageable);

    /** Returns booking summaries for one workflow status. */
    @Query("""
    SELECT new com.caraivatours.hub.booking.dto.response.BookingSummaryDTO(
        b.id,
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

    @Query("""
            SELECT COALESCE(SUM(CASE WHEN b.currentStatus IN :confirmedStatuses THEN b.financialData.commissionValue ELSE 0 END), 0) AS commissionRevenue,
                   COALESCE(SUM(CASE WHEN b.currentStatus = :completedStatus THEN 1 ELSE 0 END), 0) AS completedTours,
                   COALESCE(SUM(CASE WHEN b.currentStatus = :draftStatus THEN 1 ELSE 0 END), 0) AS pendingDrafts
            FROM Booking b
            WHERE b.attendant.id = :userId AND b.createdAt >= :start AND b.createdAt < :end
            """)
    EmployeeMetricsProjection employeeMetrics(@Param("userId") Long userId, @Param("start") LocalDateTime start,
                                               @Param("end") LocalDateTime end, @Param("confirmedStatuses") List<BookingStatus> confirmedStatuses,
                                               @Param("completedStatus") BookingStatus completedStatus, @Param("draftStatus") BookingStatus draftStatus);

    @Query("""
            SELECT COALESCE(SUM(CASE WHEN b.currentStatus IN :confirmedStatuses THEN b.financialData.totalPrice ELSE 0 END), 0) AS confirmedRevenue,
                   COALESCE(SUM(CASE WHEN b.currentStatus = :draftStatus THEN b.financialData.totalPrice ELSE 0 END), 0) AS receivable,
                   COALESCE(SUM(CASE WHEN b.currentStatus = :cancelledStatus THEN 1 ELSE 0 END), 0) AS cancelledOrders,
                   COALESCE(SUM(CASE WHEN b.currentStatus <> :cancelledStatus THEN b.financialData.totalPrice ELSE 0 END), 0) AS grossRevenue
            FROM Booking b
            WHERE b.createdAt >= :start AND b.createdAt < :end
            """)
    FinanceMetricsProjection financeMetrics(@Param("start") LocalDateTime start, @Param("end") LocalDateTime end,
                                            @Param("confirmedStatuses") List<BookingStatus> confirmedStatuses,
                                            @Param("draftStatus") BookingStatus draftStatus, @Param("cancelledStatus") BookingStatus cancelledStatus);

    @Query("""
            SELECT b.currentStatus AS status, COALESCE(SUM(b.financialData.commissionValue), 0) AS amount
            FROM Booking b WHERE b.attendant.id = :userId AND b.createdAt >= :start AND b.createdAt < :end
            GROUP BY b.currentStatus
            """)
    List<StatusAmountProjection> commissionByStatus(@Param("userId") Long userId, @Param("start") LocalDateTime start, @Param("end") LocalDateTime end);

    @Query("""
            SELECT b.tour.id AS tourId, b.tour.name AS tourName, COUNT(b) AS bookingCount
            FROM Booking b WHERE b.attendant.id = :userId AND b.createdAt >= :start AND b.createdAt < :end
            GROUP BY b.tour.id, b.tour.name ORDER BY COUNT(b) DESC
            """)
    List<TourDemandProjection> mostRequestedTours(@Param("userId") Long userId, @Param("start") LocalDateTime start, @Param("end") LocalDateTime end);

    @Query("""
            SELECT b.tour.id AS tourId, b.tour.name AS tourName, COALESCE(SUM(b.financialData.totalPrice), 0) AS revenue
            FROM Booking b WHERE b.currentStatus = :confirmedStatus AND b.createdAt >= :start AND b.createdAt < :end
            GROUP BY b.tour.id, b.tour.name ORDER BY SUM(b.financialData.totalPrice) DESC
            """)
    List<TourRevenueProjection> confirmedTourRevenue(@Param("confirmedStatus") BookingStatus confirmedStatus,
                                                      @Param("start") LocalDateTime start, @Param("end") LocalDateTime end);

    @Query(value = """
            SELECT DATE_TRUNC('day', b.created_at) AS day, COALESCE(SUM(b.total_price_snapshot), 0) AS revenue
            FROM booking b WHERE b.user_id = :userId AND b.created_at >= :start AND b.created_at < :end
              AND b.current_status IN ('COMPLETED', 'CONFIRMED')
            GROUP BY DATE_TRUNC('day', b.created_at) ORDER BY day
            """, nativeQuery = true)
    List<WeeklyRevenueProjection> weeklyRevenue(@Param("userId") Long userId, @Param("start") LocalDateTime start, @Param("end") LocalDateTime end);

    long countByAttendantIdAndCreatedAtGreaterThanEqualAndCreatedAtLessThan(Long attendantId, LocalDateTime start, LocalDateTime end);

    List<Booking> findTop5ByAttendantIdOrderByCreatedAtDesc(Long attendantId);
}

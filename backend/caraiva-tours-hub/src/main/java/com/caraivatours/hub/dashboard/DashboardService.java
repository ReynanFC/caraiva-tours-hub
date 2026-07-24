package com.caraivatours.hub.dashboard;

import com.caraivatours.hub.booking.BookingMapper;
import com.caraivatours.hub.booking.BookingRepository;
import com.caraivatours.hub.booking.dto.response.BookingSummaryDTO;
import com.caraivatours.hub.booking.enums.BookingStatus;
import com.caraivatours.hub.dashboard.dto.response.*;
import com.caraivatours.hub.dashboard.projection.*;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.cache.annotation.Cacheable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.time.*;
import java.time.temporal.TemporalAdjusters;
import java.util.*;

@Service
@Slf4j
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class DashboardService {

    private static final List<BookingStatus> REVENUE_STATUSES = List.of(BookingStatus.COMPLETED, BookingStatus.CONFIRMED);
    private final BookingRepository bookingRepository;
    private final BookingMapper bookingMapper;

    @Cacheable(value = "dashboard-user", key = "#userId + ':' + #month + ':' + #all")
    public UserDashboardDTO getUserDashboard(Long userId, YearMonth month, boolean all) {
        Period period = resolvePeriod(month, all);

        log.info("Building user dashboard for user ID {} and period {}", userId, period.label());
        log.debug("User dashboard cache miss: userId={}, start={}, end={}, all={}", userId, period.start(), period.end(), all);

        EmployeeMetricsProjection metrics = bookingRepository.employeeMetrics(userId, period.start(), period.end(),
                REVENUE_STATUSES, BookingStatus.CONFIRMED, BookingStatus.DRAFT);

        List<StatusAmountDTO> statusAmounts = bookingRepository.commissionByStatus(userId, period.start(), period.end())
                .stream()
                .map(item -> new StatusAmountDTO(
                        item.getStatus(), amount(item.getAmount()))).toList();

        BigDecimal pendingCommissions = statusAmounts.stream()
                .filter(item -> item.status() == BookingStatus.DRAFT)
                .map(StatusAmountDTO::amount).reduce(BigDecimal.ZERO, BigDecimal::add);
        log.debug("User dashboard commissions: userId={}, statuses={}, pending={}", userId, statusAmounts.size(), pendingCommissions);

        List<TourDemandProjection> demand = bookingRepository.mostRequestedTours(
                userId,
                period.start(),
                period.end());

        long totalDemand = demand.stream()
                .mapToLong(TourDemandProjection::getBookingCount).sum();
        log.debug("User dashboard demand: userId={}, tours={}, bookings={}", userId, demand.size(), totalDemand);

        List<TourDemandDTO> tours = demand.stream()
                .map(item -> new TourDemandDTO(
                        item.getTourId(),
                        item.getTourName(),
                        item.getBookingCount(),
                        percentage(item.getBookingCount(), totalDemand)))
                .toList();

        List<BookingSummaryDTO> latestBookings = bookingRepository.findTop5ByAttendantIdOrderByCreatedAtDesc(userId)
                .stream().map(bookingMapper::toSummary).toList();

        LocalDate today = LocalDate.now();
        long todayBookings = bookingRepository.countByAttendantIdAndCreatedAtGreaterThanEqualAndCreatedAtLessThan(
                userId,
                today.atStartOfDay(),
                today.plusDays(1).atStartOfDay());
        log.debug("User dashboard result: userId={}, todayBookings={}, latestBookings={}", userId, todayBookings, latestBookings.size());

        return new UserDashboardDTO(
                amount(metrics.getCommissionRevenue()), todayBookings, pendingCommissions, statusAmounts,
                weeklyRevenue(userId), tours, latestBookings,
                new EmployeeDashboardDTO(amount(metrics.getCommissionRevenue()), count(metrics.getCompletedTours()), count(metrics.getPendingDrafts()))
        );
    }

    @Cacheable(value = "dashboard-finance", key = "#month + ':' + #all")
    public FinanceDashboardDTO getFinanceDashboard(YearMonth month, boolean all) {
        Period period = resolvePeriod(month, all);

        log.info("Building finance dashboard for period {}", period.label());
        log.debug("Finance dashboard cache miss: start={}, end={}, all={}", period.start(), period.end(), all);

        FinanceMetricsProjection metrics = bookingRepository.financeMetrics(period.start(), period.end(), REVENUE_STATUSES,
                BookingStatus.DRAFT, BookingStatus.CANCELLED);

        List<TourRevenueDTO> tourRevenue = bookingRepository.confirmedTourRevenue(BookingStatus.CONFIRMED, period.start(), period.end())
                .stream()
                .map(item -> new TourRevenueDTO(
                        item.getTourId(), item.getTourName(), amount(item.getRevenue())))
                .toList();
        log.debug("Finance dashboard result: confirmedRevenue={}, receivable={}, cancelledOrders={}, tours={}",
                amount(metrics.getConfirmedRevenue()), amount(metrics.getReceivable()), count(metrics.getCancelledOrders()), tourRevenue.size());

        return new FinanceDashboardDTO(
                amount(metrics.getConfirmedRevenue()),
                amount(metrics.getReceivable()),
                count(metrics.getCancelledOrders()),
                amount(metrics.getGrossRevenue()), tourRevenue);
    }

    private List<WeeklyRevenueDTO> weeklyRevenue(Long userId) {
        LocalDate monday = LocalDate.now().with(TemporalAdjusters.previousOrSame(DayOfWeek.MONDAY));

        Map<LocalDate, BigDecimal> byDay = new HashMap<>();

        bookingRepository.weeklyRevenue(userId, monday.atStartOfDay(), monday.plusDays(7).atStartOfDay())
                .forEach(item -> byDay.put(item.getDay().toLocalDate(), amount(item.getRevenue())));

        List<WeeklyRevenueDTO> result = new ArrayList<>();

        for (int day = 0; day < 7; day++) {
            LocalDate date = monday.plusDays(day);
            result.add(new WeeklyRevenueDTO(date, byDay.getOrDefault(date, BigDecimal.ZERO)));
        }
        log.debug("Weekly revenue assembled for userId={} from {} to {}", userId, monday, monday.plusDays(6));
        return result;
    }

    private Period resolvePeriod(YearMonth month, boolean all) {
        if (all) return new Period(LocalDateTime.of(1970, 1, 1, 0, 0), LocalDateTime.now().plusNanos(1), "all");

        YearMonth selected = month == null ? YearMonth.now() : month;

        return new Period(selected.atDay(1).atStartOfDay(), selected.plusMonths(1).atDay(1).atStartOfDay(), selected.toString());
    }

    private BigDecimal amount(BigDecimal value) { return value == null ? BigDecimal.ZERO : value; }

    private long count(Long value) { return value == null ? 0 : value; }

    private double percentage(long value, long total) { return total == 0 ? 0 : BigDecimal.valueOf(value * 100.0 / total).setScale(2, RoundingMode.HALF_UP).doubleValue(); }

    private record Period(LocalDateTime start, LocalDateTime end, String label) {}
}
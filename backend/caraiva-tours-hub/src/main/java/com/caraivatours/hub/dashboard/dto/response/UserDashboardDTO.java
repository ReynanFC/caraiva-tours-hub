package com.caraivatours.hub.dashboard.dto.response;

import com.caraivatours.hub.booking.dto.response.BookingSummaryDTO;
import java.math.BigDecimal;
import java.util.List;

public record UserDashboardDTO(
        BigDecimal monthlyRevenue,
        long todayBookings,
        BigDecimal pendingCommissions,
        List<StatusAmountDTO> confirmationStatus,
        List<WeeklyRevenueDTO> weeklyRevenue,
        List<TourDemandDTO> mostRequestedTours,
        List<BookingSummaryDTO> latestBookings,
        EmployeeDashboardDTO employeeMetrics
) {}

package com.caraivatours.hub.dashboard.dto.response;

import java.math.BigDecimal;

public record EmployeeDashboardDTO(
        BigDecimal monthlyCommissionRevenue,
        long completedTours,
        long pendingDraftBookings
) {}

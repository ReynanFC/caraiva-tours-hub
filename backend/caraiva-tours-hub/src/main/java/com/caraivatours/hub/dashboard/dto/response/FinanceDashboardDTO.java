package com.caraivatours.hub.dashboard.dto.response;

import java.math.BigDecimal;
import java.util.List;

public record FinanceDashboardDTO(
        BigDecimal confirmedRevenue,
        BigDecimal receivable,
        long cancelledOrders,
        BigDecimal grossRevenue,
        List<TourRevenueDTO> confirmedTourRevenue,
        List<TourDemandDTO> mostRequestedTours,
        List<EmployeeSalesRankingDTO> employeeRanking
) {}

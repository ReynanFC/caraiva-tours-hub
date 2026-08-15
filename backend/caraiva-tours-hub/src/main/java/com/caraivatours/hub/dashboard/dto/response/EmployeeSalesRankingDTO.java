package com.caraivatours.hub.dashboard.dto.response;

import java.math.BigDecimal;

public record EmployeeSalesRankingDTO(
        long rankingPosition,
        long employeeId,
        String employeeName,
        BigDecimal totalSales,
        BigDecimal totalCommission,
        long bookingCount
) {
}

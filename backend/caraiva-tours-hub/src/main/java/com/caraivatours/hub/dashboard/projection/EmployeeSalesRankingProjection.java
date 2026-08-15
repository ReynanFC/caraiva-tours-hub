package com.caraivatours.hub.dashboard.projection;

import java.math.BigDecimal;

public interface EmployeeSalesRankingProjection {
    Long getRankingPosition();
    Long getEmployeeId();
    String getEmployeeName();
    BigDecimal getTotalSales();
    BigDecimal getTotalCommission();
    Long getBookingCount();
}

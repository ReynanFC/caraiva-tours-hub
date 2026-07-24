package com.caraivatours.hub.dashboard.projection;

import java.math.BigDecimal;

public interface EmployeeMetricsProjection {
    BigDecimal getCommissionRevenue();
    Long getCompletedTours();
    Long getPendingDrafts();
}

package com.caraivatours.hub.dashboard.projection;

import java.math.BigDecimal;

public interface FinanceMetricsProjection {
    BigDecimal getConfirmedRevenue();
    BigDecimal getReceivable();
    Long getCancelledOrders();
    BigDecimal getGrossRevenue();
}

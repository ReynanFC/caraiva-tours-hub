package com.caraivatours.hub.dashboard.projection;

import java.math.BigDecimal;
import java.time.LocalDateTime;

public interface WeeklyRevenueProjection {
    LocalDateTime getDay();
    BigDecimal getRevenue();
}

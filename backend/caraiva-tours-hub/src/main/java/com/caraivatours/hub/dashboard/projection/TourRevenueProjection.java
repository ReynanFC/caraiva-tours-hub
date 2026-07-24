package com.caraivatours.hub.dashboard.projection;

import java.math.BigDecimal;

public interface TourRevenueProjection {
    Long getTourId();
    String getTourName();
    BigDecimal getRevenue();
}

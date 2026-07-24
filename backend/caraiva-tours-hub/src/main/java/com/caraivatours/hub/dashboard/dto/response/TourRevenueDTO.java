package com.caraivatours.hub.dashboard.dto.response;

import java.math.BigDecimal;

public record TourRevenueDTO(Long tourId, String tourName, BigDecimal revenue) {}

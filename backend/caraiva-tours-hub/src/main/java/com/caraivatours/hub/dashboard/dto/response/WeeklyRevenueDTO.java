package com.caraivatours.hub.dashboard.dto.response;

import java.math.BigDecimal;
import java.time.LocalDate;

public record WeeklyRevenueDTO(LocalDate day, BigDecimal revenue) {}

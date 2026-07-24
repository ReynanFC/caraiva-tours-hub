package com.caraivatours.hub.dashboard.dto.response;

import com.caraivatours.hub.booking.enums.BookingStatus;
import java.math.BigDecimal;

public record StatusAmountDTO(BookingStatus status, BigDecimal amount) {}

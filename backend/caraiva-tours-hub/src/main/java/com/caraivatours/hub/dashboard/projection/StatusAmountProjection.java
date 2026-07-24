package com.caraivatours.hub.dashboard.projection;

import com.caraivatours.hub.booking.enums.BookingStatus;
import java.math.BigDecimal;

public interface StatusAmountProjection {
    BookingStatus getStatus();
    BigDecimal getAmount();
}

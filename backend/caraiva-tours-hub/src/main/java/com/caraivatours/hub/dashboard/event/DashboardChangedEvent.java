package com.caraivatours.hub.dashboard.event;

import com.caraivatours.hub.dashboard.event.enums.DashboardChangeReason;

public record DashboardChangedEvent(
        Long bookingId,
        DashboardChangeReason reason
) {
}

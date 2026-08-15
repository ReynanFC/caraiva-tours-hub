package com.caraivatours.hub.dashboard.dto.response;

import com.caraivatours.hub.dashboard.event.enums.DashboardChangeReason;
import com.caraivatours.hub.dashboard.event.enums.DashboardView;

import java.time.Instant;

public record DashboardChangedDTO(
        Long bookingId,
        DashboardChangeReason reason,
        DashboardView view,
        Instant occurredAt
) {
}

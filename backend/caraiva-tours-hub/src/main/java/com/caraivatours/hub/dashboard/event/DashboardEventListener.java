package com.caraivatours.hub.dashboard.event;

import com.caraivatours.hub.booking.event.BookingStatusChangedEvent;
import com.caraivatours.hub.auth.entity.enums.UserRole;
import com.caraivatours.hub.dashboard.dto.response.DashboardChangedDTO;
import com.caraivatours.hub.dashboard.event.enums.DashboardChangeReason;
import com.caraivatours.hub.dashboard.event.enums.DashboardView;
import com.caraivatours.hub.dashboard.sse.DashboardSseService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Component;
import org.springframework.transaction.event.TransactionPhase;
import org.springframework.transaction.event.TransactionalEventListener;

import java.time.Instant;

@Component
@RequiredArgsConstructor
public class DashboardEventListener {

    private final DashboardSseService dashboardSseService;

    @TransactionalEventListener(phase = TransactionPhase.AFTER_COMMIT)
    public void onBookingStatusChanged(BookingStatusChangedEvent event) {
        DashboardChangeReason reason = event.previousStatus() == null
                ? DashboardChangeReason.BOOKING_CREATED
                : DashboardChangeReason.BOOKING_STATUS_CHANGED;
        notifyDashboard(event.bookingId(), reason);
    }

    @TransactionalEventListener(phase = TransactionPhase.AFTER_COMMIT)
    public void onDashboardChanged(DashboardChangedEvent event) {
        notifyDashboard(event.bookingId(), event.reason());
    }

    private void notifyDashboard(Long bookingId, DashboardChangeReason reason) {
        Instant occurredAt = Instant.now();

        dashboardSseService.sendToRole(UserRole.EMPLOYEE, new DashboardChangedDTO(
                bookingId, reason, DashboardView.USER, occurredAt
        ));
        dashboardSseService.sendToRole(UserRole.ADMIN, new DashboardChangedDTO(
                bookingId, reason, DashboardView.FINANCE, occurredAt
        ));
    }
}

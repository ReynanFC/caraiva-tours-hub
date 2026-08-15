package com.caraivatours.hub.dashboard.controller;

import com.caraivatours.hub.auth.dto.AuthenticatedUser;
import com.caraivatours.hub.dashboard.DashboardService;
import com.caraivatours.hub.dashboard.sse.DashboardSseService;
import com.caraivatours.hub.dashboard.controller.docs.DashboardControllerDocs;
import com.caraivatours.hub.dashboard.dto.response.FinanceDashboardDTO;
import com.caraivatours.hub.dashboard.dto.response.UserDashboardDTO;
import com.caraivatours.hub.shared.validation.IsAdmin;
import com.caraivatours.hub.shared.validation.IsEmployee;
import lombok.RequiredArgsConstructor;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.servlet.mvc.method.annotation.SseEmitter;

import java.time.YearMonth;

@RestController
@RequestMapping("/api/dashboard")
@RequiredArgsConstructor
public class DashboardController implements DashboardControllerDocs {
    private final DashboardService dashboardService;
    private final DashboardSseService dashboardSseService;

    @GetMapping(
        value = "/events",
        produces = MediaType.TEXT_EVENT_STREAM_VALUE
    )
    public SseEmitter subscribe(@AuthenticationPrincipal AuthenticatedUser user) {
        return dashboardSseService.subscribe(user.id(), user.role(), user.tokenExpiresAt());
    }

    @IsEmployee
    @GetMapping
    public ResponseEntity<UserDashboardDTO> userDashboard(
            @AuthenticationPrincipal AuthenticatedUser authenticatedUser,
            @RequestParam(required = false) @DateTimeFormat(pattern = "yyyy-MM") YearMonth month,
            @RequestParam(defaultValue = "false") boolean all) {
        return ResponseEntity.ok(dashboardService.getUserDashboard(authenticatedUser.id(), month, all));
    }

    @IsAdmin
    @GetMapping("/finance")
    public ResponseEntity<FinanceDashboardDTO> financeDashboard(
            @RequestParam(required = false) @DateTimeFormat(pattern = "yyyy-MM") YearMonth month,
            @RequestParam(defaultValue = "false") boolean all) {
        return ResponseEntity.ok(dashboardService.getFinanceDashboard(month, all));
    }
}

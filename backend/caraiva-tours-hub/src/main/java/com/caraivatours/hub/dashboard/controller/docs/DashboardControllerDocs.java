package com.caraivatours.hub.dashboard.controller.docs;

import com.caraivatours.hub.auth.dto.AuthenticatedUser;
import com.caraivatours.hub.dashboard.dto.response.FinanceDashboardDTO;
import com.caraivatours.hub.dashboard.dto.response.UserDashboardDTO;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.media.Content;
import io.swagger.v3.oas.annotations.media.Schema;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.springframework.http.ResponseEntity;
import java.time.YearMonth;

@Tag(name = "Dashboard", description = "Personal and financial operational metrics")
public interface DashboardControllerDocs {
    @Operation(summary = "Get my dashboard", description = "Returns personal revenue, reservations, commissions, weekly revenue, demand and latest bookings. `month` uses yyyy-MM; use `all=true` for all-time monthly metrics.", responses = {
            @ApiResponse(responseCode = "200", description = "Dashboard retrieved", content = @Content(schema = @Schema(implementation = UserDashboardDTO.class))),
            @ApiResponse(responseCode = "401", description = "Unauthenticated", content = @Content)})
    ResponseEntity<UserDashboardDTO> userDashboard(@Parameter(hidden = true) AuthenticatedUser authenticatedUser, YearMonth month, boolean all);

    @Operation(summary = "Get financial dashboard", description = "Returns monthly global confirmed revenue, receivable amount, cancelled orders, gross revenue and confirmed-tour revenue. Administrator only.", responses = {
            @ApiResponse(responseCode = "200", description = "Financial dashboard retrieved", content = @Content(schema = @Schema(implementation = FinanceDashboardDTO.class))),
            @ApiResponse(responseCode = "401", description = "Unauthenticated", content = @Content),
            @ApiResponse(responseCode = "403", description = "Administrator access required", content = @Content)})
    ResponseEntity<FinanceDashboardDTO> financeDashboard(YearMonth month, boolean all);
}

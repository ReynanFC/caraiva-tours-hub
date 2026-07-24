package com.caraivatours.hub.refundrequest.controller.docs;

import com.caraivatours.hub.auth.dto.AuthenticatedUser;
import com.caraivatours.hub.refundrequest.dto.request.CreateRefundRequestDTO;
import com.caraivatours.hub.refundrequest.dto.request.ResolveRefundRequestDTO;
import com.caraivatours.hub.refundrequest.dto.response.RefundRequestResponseDTO;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.media.Content;
import io.swagger.v3.oas.annotations.media.Schema;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.springframework.http.ResponseEntity;

@Tag(name = "Refund requests", description = "Endpoints for requesting and resolving booking refunds")
public interface RefundRequestControllerDocs {

    @Operation(
            summary = "Request a refund",
            description = "Creates a pending refund request. Only non-admin users can request it; the related booking is moved to `CANCEL_REQUEST`.",
            responses = {
                    @ApiResponse(responseCode = "201", description = "Refund request created", content = @Content(schema = @Schema(implementation = RefundRequestResponseDTO.class))),
                    @ApiResponse(responseCode = "400", description = "Admin requester, invalid booking state, or an existing pending request", content = @Content),
                    @ApiResponse(responseCode = "401", description = "Unauthenticated", content = @Content),
                    @ApiResponse(responseCode = "404", description = "Booking or user not found", content = @Content)
            }
    )
    ResponseEntity<RefundRequestResponseDTO> create(
            @Parameter(hidden = true) AuthenticatedUser authenticatedUser,
            CreateRefundRequestDTO request
    );

    @Operation(
            summary = "Resolve a refund request",
            description = "Approves or rejects a pending request. Only administrators can resolve it. On approval, the booking is moved to `CANCELLED`.",
            responses = {
                    @ApiResponse(responseCode = "200", description = "Refund request resolved", content = @Content(schema = @Schema(implementation = RefundRequestResponseDTO.class))),
                    @ApiResponse(responseCode = "400", description = "Non-admin resolver, invalid status, or request already resolved", content = @Content),
                    @ApiResponse(responseCode = "401", description = "Unauthenticated", content = @Content),
                    @ApiResponse(responseCode = "404", description = "Refund request or user not found", content = @Content)
            }
    )
    ResponseEntity<RefundRequestResponseDTO> resolve(
            @Parameter(description = "Refund request identifier", required = true) Long id,
            @Parameter(hidden = true) AuthenticatedUser authenticatedUser,
            ResolveRefundRequestDTO request
    );
}

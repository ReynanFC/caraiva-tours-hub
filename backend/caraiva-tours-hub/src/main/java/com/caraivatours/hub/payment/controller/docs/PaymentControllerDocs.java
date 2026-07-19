package com.caraivatours.hub.payment.controller.docs;

import com.caraivatours.hub.booking.enums.BookingStatus;
import com.caraivatours.hub.payment.dto.PaymentDetailDTO;
import com.caraivatours.hub.payment.dto.PaymentSummaryDTO;
import com.caraivatours.hub.shared.dto.PagedResult;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.media.Content;
import io.swagger.v3.oas.annotations.media.Schema;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.springdoc.core.annotations.ParameterObject;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.ResponseEntity;

@Tag(name = "Payments", description = "Endpoints for consulting reservation payments")
public interface PaymentControllerDocs {

    @Operation(
            summary = "List payments",
            description = "Returns a paginated payment list. Results can be filtered by payment ID and/or client name.",
            responses = {
                    @ApiResponse(responseCode = "200", description = "Payments found",
                            content = @Content(schema = @Schema(implementation = PaymentSummaryDTO.class))),
                    @ApiResponse(responseCode = "401", description = "Unauthenticated", content = @Content),
                    @ApiResponse(responseCode = "500", description = "Internal server error", content = @Content)
            }
    )
    ResponseEntity<PagedResult<PaymentSummaryDTO>> findAllByFilters(
            @Parameter(description = "Optional payment identifier") Long idPayment,
            @Parameter(description = "Optional fragment of the client's name") String nameClient,
            @ParameterObject Pageable pageable
    );

    @Operation(
            summary = "Get payment details",
            description = "Returns payment amounts, receipt URL and the booking status history for a payment.",
            responses = {
                    @ApiResponse(responseCode = "200", description = "Payment found",
                            content = @Content(schema = @Schema(implementation = PaymentDetailDTO.class))),
                    @ApiResponse(responseCode = "401", description = "Unauthenticated", content = @Content),
                    @ApiResponse(responseCode = "404", description = "Payment not found", content = @Content),
                    @ApiResponse(responseCode = "500", description = "Internal server error", content = @Content)
            }
    )
    ResponseEntity<PaymentDetailDTO> findById(
            @Parameter(description = "Payment identifier", required = true) Long id
    );

    @Operation(
            summary = "List payments by booking status",
            description = "Returns a paginated list of payments whose related booking has the informed status.",
            responses = {
                    @ApiResponse(responseCode = "200", description = "Payments found",
                            content = @Content(schema = @Schema(implementation = PaymentSummaryDTO.class))),
                    @ApiResponse(responseCode = "401", description = "Unauthenticated", content = @Content),
                    @ApiResponse(responseCode = "500", description = "Internal server error", content = @Content)
            }
    )
    ResponseEntity<PagedResult<PaymentSummaryDTO>> findByBookingStatus(
            @Parameter(description = "Current status of the related booking", required = true) BookingStatus status,
            @ParameterObject Pageable pageable
    );
}

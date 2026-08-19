package com.caraivatours.hub.booking.controller.docs;

import com.caraivatours.hub.auth.dto.AuthenticatedUser;
import com.caraivatours.hub.booking.dto.request.CreateBookingRequest;
import com.caraivatours.hub.booking.dto.request.CancelBookingRequest;
import com.caraivatours.hub.booking.dto.request.UpdateBookingRequest;
import com.caraivatours.hub.booking.dto.response.BookingDetailDTO;
import com.caraivatours.hub.booking.dto.response.BookingSummaryDTO;
import com.caraivatours.hub.booking.enums.BookingStatus;
import com.caraivatours.hub.groupmember.dto.GroupMemberDTO;
import com.caraivatours.hub.shared.dto.PagedResult;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.media.Content;
import io.swagger.v3.oas.annotations.media.Schema;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.springdoc.core.annotations.ParameterObject;
import org.springframework.core.io.Resource;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.ResponseEntity;

import java.util.Set;

@Tag(name = "Bookings", description = "Endpoints for creating and managing tour bookings")
public interface BookingControllerDocs {

    @Operation(summary = "List bookings", responses = {
            @ApiResponse(responseCode = "200", description = "Bookings retrieved", content = @Content(schema = @Schema(implementation = BookingSummaryDTO.class)))
    })
    ResponseEntity<PagedResult<BookingSummaryDTO>> findAll(
            String search,
            BookingStatus status,
            @ParameterObject Pageable pageable
    );

    @Operation(summary = "List bookings by status", responses = {
            @ApiResponse(responseCode = "200", description = "Bookings retrieved", content = @Content(schema = @Schema(implementation = BookingSummaryDTO.class)))
    })
    ResponseEntity<PagedResult<BookingSummaryDTO>> findByStatus(BookingStatus status, @ParameterObject Pageable pageable);

    @Operation(summary = "Get booking details", responses = {
            @ApiResponse(responseCode = "200", description = "Booking retrieved", content = @Content(schema = @Schema(implementation = BookingDetailDTO.class))),
            @ApiResponse(responseCode = "404", description = "Booking not found", content = @Content)
    })
    ResponseEntity<BookingDetailDTO> findDetails(@Parameter(description = "Booking ID") Long id);

    @Operation(
            summary = "Generate booking receipt",
            description = "Generates and returns the booking receipt as a PDF for inline viewing.",
            responses = {
                    @ApiResponse(
                            responseCode = "200",
                            description = "Receipt generated successfully",
                            content = @Content(
                                    mediaType = "application/pdf",
                                    schema = @Schema(type = "string", format = "binary")
                            )
                    ),
                    @ApiResponse(
                            responseCode = "500",
                            description = "Error generating or exporting the receipt",
                            content = @Content
                    )
            }
    )
    ResponseEntity<Resource> generateReceipt(@Parameter(description = "Booking ID") Long id);

    @Operation(summary = "Create a booking", responses = {
            @ApiResponse(responseCode = "201", description = "Booking created", content = @Content(schema = @Schema(implementation = BookingSummaryDTO.class))),
            @ApiResponse(responseCode = "400", description = "Invalid request", content = @Content),
            @ApiResponse(responseCode = "404", description = "Tour or user not found", content = @Content)
    })
    ResponseEntity<BookingSummaryDTO> create(@Parameter(hidden = true) AuthenticatedUser authenticatedUser, CreateBookingRequest request);

    @Operation(summary = "Confirm a booking", responses = {
            @ApiResponse(responseCode = "200", description = "Booking confirmed", content = @Content(schema = @Schema(implementation = BookingSummaryDTO.class))),
            @ApiResponse(responseCode = "404", description = "Booking or user not found", content = @Content)
    })
    ResponseEntity<BookingSummaryDTO> confirm(Long id, @Parameter(hidden = true) AuthenticatedUser authenticatedUser);

    @Operation(
            summary = "Cancel a booking",
            description = "Immediately cancels a draft or confirmed booking. Administrator access is required.",
            responses = {
                    @ApiResponse(responseCode = "200", description = "Booking cancelled", content = @Content(schema = @Schema(implementation = BookingSummaryDTO.class))),
                    @ApiResponse(responseCode = "400", description = "Booking status does not allow cancellation", content = @Content),
                    @ApiResponse(responseCode = "403", description = "Administrator access required", content = @Content),
                    @ApiResponse(responseCode = "404", description = "Booking or administrator not found", content = @Content)
            }
    )
    ResponseEntity<BookingSummaryDTO> cancel(
            @Parameter(description = "Booking ID") Long id,
            @Parameter(hidden = true) AuthenticatedUser authenticatedUser,
            CancelBookingRequest request
    );

    @Operation(summary = "Update a booking", responses = {
            @ApiResponse(responseCode = "200", description = "Booking updated", content = @Content(schema = @Schema(implementation = BookingSummaryDTO.class))),
            @ApiResponse(responseCode = "400", description = "Invalid request", content = @Content),
            @ApiResponse(responseCode = "403", description = "Employee does not own the booking", content = @Content),
            @ApiResponse(responseCode = "404", description = "Booking or tour not found", content = @Content)
    })
    ResponseEntity<BookingSummaryDTO> update(@Parameter(description = "Booking ID") Long id,
                                             @Parameter(hidden = true) AuthenticatedUser authenticatedUser,
                                             UpdateBookingRequest request);
}

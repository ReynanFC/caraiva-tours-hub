package com.caraivatours.hub.booking.controller.docs;

import com.caraivatours.hub.auth.dto.AuthenticatedUser;
import com.caraivatours.hub.booking.dto.request.CreateBookingRequest;
import com.caraivatours.hub.booking.dto.response.BookingDetailDTO;
import com.caraivatours.hub.booking.dto.response.BookingSummaryDTO;
import com.caraivatours.hub.booking.enums.BookingStatus;
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

@Tag(name = "Bookings", description = "Endpoints for creating and managing tour bookings")
public interface BookingControllerDocs {

    @Operation(summary = "List bookings", responses = {
            @ApiResponse(responseCode = "200", description = "Bookings retrieved", content = @Content(schema = @Schema(implementation = BookingSummaryDTO.class)))
    })
    ResponseEntity<Page<BookingSummaryDTO>> findAll(String search, @ParameterObject Pageable pageable);

    @Operation(summary = "List bookings by status", responses = {
            @ApiResponse(responseCode = "200", description = "Bookings retrieved", content = @Content(schema = @Schema(implementation = BookingSummaryDTO.class)))
    })
    ResponseEntity<Page<BookingSummaryDTO>> findByStatus(BookingStatus status, @ParameterObject Pageable pageable);

    @Operation(summary = "Get booking details", responses = {
            @ApiResponse(responseCode = "200", description = "Booking retrieved", content = @Content(schema = @Schema(implementation = BookingDetailDTO.class))),
            @ApiResponse(responseCode = "404", description = "Booking not found", content = @Content)
    })
    ResponseEntity<BookingDetailDTO> findDetails(@Parameter(description = "Booking ID") Long id);

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
}

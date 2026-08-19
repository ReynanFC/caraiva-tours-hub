package com.caraivatours.hub.tour.controller.docs;

import com.caraivatours.hub.shared.dto.PagedResult;
import com.caraivatours.hub.tour.dto.request.CreateTourDTO;
import com.caraivatours.hub.tour.dto.request.ToggleTourAvailabilityDTO;
import com.caraivatours.hub.tour.dto.request.UpdateTourDTO;
import com.caraivatours.hub.tour.dto.response.TourResponseDTO;
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

@Tag(name = "Tours", description = "Endpoints for managing operations related to tours/experiences")
public interface TourControllerDocs {

    @Operation(
            summary = "Find all tours with pagination",
            description = "Retrieves a paginated list of all tours. Can be filtered optionally by name and category.",
            responses = {
                    @ApiResponse(
                            description = "Success",
                            responseCode = "200",
                            content = @Content(schema = @Schema(implementation = TourResponseDTO.class))
                    ),
                    @ApiResponse(description = "Internal Server Error", responseCode = "500", content = @Content)
            }
    )
    ResponseEntity<PagedResult<TourResponseDTO>> findAllTours(
            @Parameter(description = "Optional search term to filter tours by name") String search,
            @Parameter(description = "Optional category ID to filter tours") Long categoryId,
            @ParameterObject Pageable pageable
    );

    @Operation(
            summary = "Add a new tour",
            description = "Creates a new tour experience. Tour names must be unique and must belong to an existing category. \n\n**Role Required:** `ADMIN` (hasRole('ADMIN'))",
            responses = {
                    @ApiResponse(
                            description = "Created Successfully",
                            responseCode = "201",
                            content = @Content(schema = @Schema(implementation = TourResponseDTO.class))
                    ),
                    @ApiResponse(description = "Bad Request (Validation Error or Already Exists)", responseCode = "400", content = @Content),
                    @ApiResponse(description = "Forbidden - Admin privileges required", responseCode = "403", content = @Content),
                    @ApiResponse(description = "Category not found for the provided ID", responseCode = "404", content = @Content),
                    @ApiResponse(description = "Internal Server Error", responseCode = "500", content = @Content)
            }
    )
    ResponseEntity<TourResponseDTO> createTour(CreateTourDTO dto);

    @Operation(
            summary = "Update an existing tour",
            description = "Updates all fields of an existing tour by its unique ID. Handles category transition automatically if changed. \n\n**Role Required:** `ADMIN` (hasRole('ADMIN'))",
            responses = {
                    @ApiResponse(
                            description = "Updated Successfully",
                            responseCode = "200",
                            content = @Content(schema = @Schema(implementation = TourResponseDTO.class))
                    ),
                    @ApiResponse(description = "Bad Request (Validation Error)", responseCode = "400", content = @Content),
                    @ApiResponse(description = "Forbidden - Admin privileges required", responseCode = "403", content = @Content),
                    @ApiResponse(description = "Tour or target Category not found", responseCode = "404", content = @Content),
                    @ApiResponse(description = "Internal Server Error", responseCode = "500", content = @Content)
            }
    )
    ResponseEntity<TourResponseDTO> updateTour(
            @Parameter(description = "The unique ID of the tour to update", required = true) Long id,
            UpdateTourDTO dto
    );

    @Operation(
            summary = "Toggle tour availability status",
            description = "Performs a partial (PATCH) update to quickly activate or deactivate a tour's public availability. \n\n**Role Required:** `ADMIN` (hasRole('ADMIN'))",
            responses = {
                    @ApiResponse(
                            description = "Status Updated Successfully",
                            responseCode = "200",
                            content = @Content(schema = @Schema(implementation = TourResponseDTO.class))
                    ),
                    @ApiResponse(description = "Bad Request (Validation Error)", responseCode = "400", content = @Content),
                    @ApiResponse(description = "Forbidden - Admin privileges required", responseCode = "403", content = @Content),
                    @ApiResponse(description = "Tour not found", responseCode = "404", content = @Content),
                    @ApiResponse(description = "Internal Server Error", responseCode = "500", content = @Content)
            }
    )
    ResponseEntity<TourResponseDTO> changeAvailable(
            @Parameter(description = "The unique ID of the tour", required = true) Long id,
            ToggleTourAvailabilityDTO dto
    );

    @Operation(
            summary = "Delete a tour",
            description = "Deletes a specific tour by its unique ID. Safe operation due to native relational database constraint protection. \n\n**Role Required:** `ADMIN` (hasRole('ADMIN'))",
            responses = {
                    @ApiResponse(description = "Deleted Successfully (No Content)", responseCode = "204", content = @Content),
                    @ApiResponse(description = "Forbidden - Admin privileges required", responseCode = "403", content = @Content),
                    @ApiResponse(description = "Tour not found", responseCode = "404", content = @Content),
                    @ApiResponse(description = "Internal Server Error", responseCode = "500", content = @Content)
            }
    )
    ResponseEntity<Void> deleteTour(
            @Parameter(description = "The unique ID of the tour to delete", required = true) Long id
    );
}

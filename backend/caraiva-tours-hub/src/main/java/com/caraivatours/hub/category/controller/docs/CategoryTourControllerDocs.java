package com.caraivatours.hub.category.controller.docs;

import com.caraivatours.hub.category.dto.request.CreateCategoryDTO;
import com.caraivatours.hub.category.dto.request.UpdateCategoryDTO;
import com.caraivatours.hub.category.dto.response.CategoryListItemDTO;
import com.caraivatours.hub.category.dto.response.CategoryOptionDTO;
import com.caraivatours.hub.category.dto.response.CategoryResponseDTO;
import com.caraivatours.hub.shared.dto.PagedResult;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.media.ArraySchema;
import io.swagger.v3.oas.annotations.media.Content;
import io.swagger.v3.oas.annotations.media.Schema;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.springdoc.core.annotations.ParameterObject;
import org.springframework.data.domain.Pageable;
import org.springframework.http.ResponseEntity;

import java.util.List;

@Tag(name = "Category Tour", description = "Endpoints for managing tour categories")
public interface CategoryTourControllerDocs {

    @Operation(
            summary = "Find a category tour by ID",
            description = "Retrieves a specific tour category using its unique identifier.",
            responses = {
                    @ApiResponse(
                            description = "Success",
                            responseCode = "200",
                            content = @Content(schema = @Schema(implementation = CategoryResponseDTO.class))
                    ),
                    @ApiResponse(description = "Category not found", responseCode = "404", content = @Content),
                    @ApiResponse(description = "Internal Server Error", responseCode = "500", content = @Content)
            }
    )
    ResponseEntity<CategoryResponseDTO> findById(
            @Parameter(description = "The unique ID of the category", required = true) Long id
    );

    @Operation(
            summary = "Find category options for selectors",
            description = "Retrieves a lightweight, list of category options (max 20) filtered by name. Ideal for dropdowns and select inputs.",
            responses = {
                    @ApiResponse(
                            description = "Success",
                            responseCode = "200",
                            content = @Content(array = @ArraySchema(schema = @Schema(implementation = CategoryOptionDTO.class)))
                    ),
                    @ApiResponse(description = "Internal Server Error", responseCode = "500", content = @Content)
            }
    )
    ResponseEntity<List<CategoryOptionDTO>> findOptions(
            @Parameter(description = "Optional name fragment to search and filter options") String search
    );

    @Operation(
            summary = "Find all categories with pagination",
            description = "Retrieves a paginated list of categories including their active tour counts, filtered optionally by name.",
            responses = {
                    @ApiResponse(
                            description = "Success",
                            responseCode = "200",
                            content = @Content(schema = @Schema(implementation = CategoryListItemDTO.class))
                    ),
                    @ApiResponse(description = "Internal Server Error", responseCode = "500", content = @Content)
            }
    )
    ResponseEntity<PagedResult<CategoryListItemDTO>> findAll(
            @Parameter(description = "Optional search term to filter categories by name") String search,
            @ParameterObject Pageable pageable
    );

    @Operation(
            summary = "Add a new category tour",
            description = "Creates a new category tour. The category name must be unique. \n\n**Role Required:** `ADMIN` (hasRole('ADMIN'))",
            responses = {
                    @ApiResponse(
                            description = "Created Successfully",
                            responseCode = "201",
                            content = @Content(schema = @Schema(implementation = CategoryResponseDTO.class))
                    ),
                    @ApiResponse(description = "Bad Request (Validation Error or Already Exists)", responseCode = "400", content = @Content),
                    @ApiResponse(description = "Forbidden - Admin privileges required", responseCode = "403", content = @Content),
                    @ApiResponse(description = "Internal Server Error", responseCode = "500", content = @Content)
            }
    )
    ResponseEntity<CategoryResponseDTO> addCategoryTour(CreateCategoryDTO dto);

    @Operation(
            summary = "Update an existing category tour",
            description = "Updates the name of a specific category tour found by its ID. \n\n**Role Required:** `ADMIN` (hasRole('ADMIN'))",
            responses = {
                    @ApiResponse(
                            description = "Updated Successfully",
                            responseCode = "200",
                            content = @Content(schema = @Schema(implementation = CategoryResponseDTO.class))
                    ),
                    @ApiResponse(description = "Bad Request (Validation Error)", responseCode = "400", content = @Content),
                    @ApiResponse(description = "Forbidden - Admin privileges required", responseCode = "403", content = @Content),
                    @ApiResponse(description = "Category not found", responseCode = "404", content = @Content),
                    @ApiResponse(description = "Internal Server Error", responseCode = "500", content = @Content)
            }
    )
    ResponseEntity<CategoryResponseDTO> updateCategoryTour(
            @Parameter(description = "The unique ID of the category to update", required = true) Long id,
            UpdateCategoryDTO dto
    );

    @Operation(
            summary = "Delete a category tour",
            description = "Deletes a specific category tour by its ID. Deletion will be rejected with a 409 Conflict if the category is linked to any active tours. \n\n**Role Required:** `ADMIN` (hasRole('ADMIN'))",
            responses = {
                    @ApiResponse(description = "Deleted Successfully (No Content)", responseCode = "204", content = @Content),
                    @ApiResponse(description = "Forbidden - Admin privileges required", responseCode = "403", content = @Content),
                    @ApiResponse(description = "Category not found", responseCode = "404", content = @Content),
                    @ApiResponse(description = "Conflict (Category is linked to active tours)", responseCode = "409", content = @Content),
                    @ApiResponse(description = "Internal Server Error", responseCode = "500", content = @Content)
            }
    )
    ResponseEntity<Void> deleteCategoryTour(
            @Parameter(description = "The unique ID of the category to delete", required = true) Long id
    );
}
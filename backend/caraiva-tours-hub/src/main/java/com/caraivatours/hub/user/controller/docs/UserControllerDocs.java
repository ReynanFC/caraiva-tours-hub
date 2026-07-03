package com.caraivatours.hub.user.controller.docs;

import com.caraivatours.hub.auth.dto.AuthenticatedUser;
import com.caraivatours.hub.shared.dto.PagedResult;
import com.caraivatours.hub.user.dto.request.ToggleUserEnabledDTO;
import com.caraivatours.hub.user.dto.request.UserChangePasswordDTO;
import com.caraivatours.hub.user.dto.request.UserRegistrationDTO;
import com.caraivatours.hub.user.dto.request.UserUpdateDTO;
import com.caraivatours.hub.user.dto.response.UserHeaderProjection;
import com.caraivatours.hub.user.dto.response.UserProfileDTO;
import com.caraivatours.hub.user.dto.response.UserSummaryDTO;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.media.Content;
import io.swagger.v3.oas.annotations.media.Schema;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.springdoc.core.annotations.ParameterObject;
import org.springframework.data.domain.Pageable;
import org.springframework.http.ResponseEntity;

import java.util.UUID;

@Tag(name = "User Management", description = "Endpoints for managing user accounts, profiles, and permissions")
public interface UserControllerDocs {

    @Operation(
            summary = "Find all users with pagination",
            description = "Retrieves a paginated list of system users, optionally filtered by username or email. \n\n**Role Required:** `ADMIN`",
            responses = {
                    @ApiResponse(
                            description = "Success",
                            responseCode = "200",
                            content = @Content(schema = @Schema(implementation = PagedResult.class))
                    ),
                    @ApiResponse(description = "Forbidden - Admin privileges required", responseCode = "403", content = @Content),
                    @ApiResponse(description = "Internal Server Error", responseCode = "500", content = @Content)
            }
    )
    ResponseEntity<PagedResult<UserSummaryDTO>> findAll(
            @Parameter(description = "Optional search term to filter users by username or email") String search,
            @ParameterObject Pageable pageable
    );

    @Operation(
            summary = "Get current user profile info",
            description = "Retrieves the detailed profile information of the currently authenticated session owner using the authentication token.",
            responses = {
                    @ApiResponse(
                            description = "Success",
                            responseCode = "200",
                            content = @Content(schema = @Schema(implementation = UserProfileDTO.class))
                    ),
                    @ApiResponse(description = "Unauthorized - Missing or invalid token", responseCode = "401", content = @Content),
                    @ApiResponse(description = "Internal Server Error", responseCode = "500", content = @Content)
            }
    )
    ResponseEntity<UserProfileDTO> findProfile(
            @Parameter(hidden = true) AuthenticatedUser authenticatedUser
    );

    @Operation(
            summary = "Find any user profile by internal ID",
            description = "Retrieves the complete, detailed user profile of any user in the system using their unique database ID. \n\n**Role Required:** `ADMIN`",
            responses = {
                    @ApiResponse(
                            description = "Success",
                            responseCode = "200",
                            content = @Content(schema = @Schema(implementation = UserProfileDTO.class))
                    ),
                    @ApiResponse(description = "Forbidden - Admin privileges required", responseCode = "403", content = @Content),
                    @ApiResponse(description = "User not found", responseCode = "404", content = @Content),
                    @ApiResponse(description = "Internal Server Error", responseCode = "500", content = @Content)
            }
    )
    ResponseEntity<UserProfileDTO> findProfileById(
            @Parameter(description = "The database ID of the user", required = true) Long id
    );

    @Operation(
            summary = "Get current user header data",
            description = "Retrieves lightweight context data (such as name and role) of the currently authenticated session user. Ideal for shell layouts and navbar headers.",
            responses = {
                    @ApiResponse(
                            description = "Success",
                            responseCode = "200",
                            content = @Content(schema = @Schema(implementation = UserHeaderProjection.class))
                    ),
                    @ApiResponse(description = "Unauthorized - Missing or invalid token", responseCode = "401", content = @Content),
                    @ApiResponse(description = "Internal Server Error", responseCode = "500", content = @Content)
            }
    )
    ResponseEntity<UserHeaderProjection> findHeaderData(
            @Parameter(hidden = true) AuthenticatedUser authenticatedUser
    );

    @Operation(
            summary = "Register a new user",
            description = "Creates and configures a new user account profile in the system. The provided email address must be unique. \n\n**Role Required:** `ADMIN`",
            responses = {
                    @ApiResponse(
                            description = "Created Successfully",
                            responseCode = "201",
                            content = @Content(schema = @Schema(implementation = UserSummaryDTO.class))
                    ),
                    @ApiResponse(description = "Bad Request (Validation Error or Email already exists)", responseCode = "400", content = @Content),
                    @ApiResponse(description = "Forbidden - Admin privileges required", responseCode = "403", content = @Content),
                    @ApiResponse(description = "Internal Server Error", responseCode = "500", content = @Content)
            }
    )
    ResponseEntity<UserSummaryDTO> createUser(UserRegistrationDTO userRegistrationDTO);

    @Operation(
            summary = "Update current user profile data",
            description = "Updates editable details belonging to the currently authenticated session profile. The ID is securely handled internally.",
            responses = {
                    @ApiResponse(
                            description = "Updated Successfully",
                            responseCode = "200",
                            content = @Content(schema = @Schema(implementation = UserSummaryDTO.class))
                    ),
                    @ApiResponse(description = "Bad Request (Validation Error)", responseCode = "400", content = @Content),
                    @ApiResponse(description = "Unauthorized - Missing or invalid token", responseCode = "401", content = @Content),
                    @ApiResponse(description = "Internal Server Error", responseCode = "500", content = @Content)
            }
    )
    ResponseEntity<UserSummaryDTO> updateProfile(
            @Parameter(hidden = true) AuthenticatedUser authenticatedUser,
            UserUpdateDTO userUpdateDTO
    );

    @Operation(
            summary = "Change authenticated user password",
            description = "Updates the secure login password of the session owner. Validates that the provided URL obfuscated UUID strictly matches the authenticated token token context before mutating.",
            responses = {
                    @ApiResponse(
                            description = "Password Changed Successfully",
                            responseCode = "200",
                            content = @Content(schema = @Schema(implementation = UserSummaryDTO.class))
                    ),
                    @ApiResponse(description = "Bad Request (Incorrect current password / validation failure)", responseCode = "400", content = @Content),
                    @ApiResponse(description = "Forbidden - Token context does not match requested URL resource obfuscated parameter", responseCode = "403", content = @Content),
                    @ApiResponse(description = "Internal Server Error", responseCode = "500", content = @Content)
            }
    )
    ResponseEntity<UserSummaryDTO> changePassword(
            @Parameter(description = "The public obfuscated UUID matching the active token user context", required = true) UUID uuid,
            @Parameter(hidden = true) AuthenticatedUser authenticatedUser,
            UserChangePasswordDTO changePasswordDTO
    );

    @Operation(
            summary = "Toggle user enabled/disabled status state",
            description = "Allows toggling whether a user account profile is flag active or suspended across the system ecosystem. \n\n**Role Required:** `ADMIN`",
            responses = {
                    @ApiResponse(
                            description = "Status Updated Successfully",
                            responseCode = "200",
                            content = @Content(schema = @Schema(implementation = UserSummaryDTO.class))
                    ),
                    @ApiResponse(description = "Forbidden - Admin privileges required", responseCode = "403", content = @Content),
                    @ApiResponse(description = "User not found", responseCode = "404", content = @Content),
                    @ApiResponse(description = "Internal Server Error", responseCode = "500", content = @Content)
            }
    )
    ResponseEntity<UserSummaryDTO> changeEnabled(
            @Parameter(description = "The database ID of the user to activate/deactivate", required = true) Long id,
            ToggleUserEnabledDTO userEnabledDTO
    );
}
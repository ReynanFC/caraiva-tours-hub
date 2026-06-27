package com.caraivatours.hub.auth.controller.doc;

import com.caraivatours.hub.auth.dto.AccountCredentialsDTO;
import com.caraivatours.hub.auth.dto.TokenDTO;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.enums.ParameterIn;
import io.swagger.v3.oas.annotations.media.Content;
import io.swagger.v3.oas.annotations.media.Schema;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.servlet.http.HttpServletResponse;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CookieValue;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;

@Tag(name = "Authentication", description = "Endpoints for user authentication and token management")
public interface AuthControllerDocs {


    @Operation(
            summary = "Authenticates a user and returns an access token",
            description = "Authenticates a user by validating the username and password. Returns an access token in the response body and sets an HttpOnly cookie with the refresh token.",
            responses = {
                    @ApiResponse(
                            description = "Success",
                            responseCode = "200",
                            content = @Content(schema = @Schema(implementation = TokenDTO.class))
                    ),
                    @ApiResponse(description = "Bad Request (Validation Error)", responseCode = "400", content = @Content),
                    @ApiResponse(description = "Unauthorized (Invalid Credentials)", responseCode = "401", content = @Content),
                    @ApiResponse(description = "Internal Server Error", responseCode = "500", content = @Content)
            }
    )
    @PostMapping("/signin")
    ResponseEntity<TokenDTO> signIn(
            @Valid @RequestBody AccountCredentialsDTO credentials,
            @Parameter(hidden = true) HttpServletResponse response
    );

    @Operation(
            summary = "Refresh token for authenticated user",
            description = "Refreshes an expired access token using a valid refresh token provided via an HttpOnly cookie.",
            security = { @SecurityRequirement(name = "cookieAuth") },
            responses = {
                    @ApiResponse(
                            description = "Success",
                            responseCode = "200",
                            content = @Content(schema = @Schema(implementation = TokenDTO.class))
                    ),
                    @ApiResponse(description = "Bad Request (Missing Cookie)", responseCode = "400", content = @Content),
                    @ApiResponse(description = "Unauthorized / Forbidden (Invalid or Expired Refresh Token)", responseCode = "401", content = @Content),
                    @ApiResponse(description = "Internal Server Error", responseCode = "500", content = @Content)
            }
    )
    @PostMapping("/refresh")
    ResponseEntity<TokenDTO> refresh(
            @Parameter(
                    in = ParameterIn.COOKIE,
                    name = "refreshToken",
                    description = "The HttpOnly refresh token cookie",
                    required = true
            )
            @CookieValue(name = "refreshToken", required = false) String refreshToken,

            @Parameter(hidden = true) HttpServletResponse response
    );
}
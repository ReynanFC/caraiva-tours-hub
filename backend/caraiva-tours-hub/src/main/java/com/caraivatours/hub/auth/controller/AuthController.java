package com.caraivatours.hub.auth.controller;

import com.caraivatours.hub.auth.AuthService;
import com.caraivatours.hub.auth.controller.doc.AuthControllerDocs;
import com.caraivatours.hub.auth.dto.AccountCredentialsDTO;
import com.caraivatours.hub.auth.dto.TokenDTO;
import jakarta.servlet.http.HttpServletResponse;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpHeaders;
import org.springframework.http.ResponseCookie;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.Duration;

@RestController
@RequestMapping("/auth")
@RequiredArgsConstructor
public class AuthController implements AuthControllerDocs {

    private static final String REFRESH_COOKIE_NAME = "refreshToken";

    @Value("${app.security.cookie.secure:true}")
    private boolean cookieSecure;

    private final AuthService authService;


    @PostMapping("/signin")
    @Override
    public ResponseEntity<TokenDTO> signIn(@Valid @RequestBody AccountCredentialsDTO credentials, HttpServletResponse response) {

        ResponseEntity<TokenDTO> result = authService.signIn(credentials);
        TokenDTO bodyWithoutRefresh = finalizeTokenResponse(result.getBody(), response);

        return ResponseEntity.status(result.getStatusCode()).body(bodyWithoutRefresh);
    }

    @PostMapping("/refresh")
    @Override
    public ResponseEntity<TokenDTO> refresh(@CookieValue(name = REFRESH_COOKIE_NAME, required = false) String refreshToken, HttpServletResponse response) {

        ResponseEntity<TokenDTO> result = authService.refreshToken(refreshToken);
        TokenDTO bodyWithoutRefresh = finalizeTokenResponse(result.getBody(), response);

        return ResponseEntity.status(result.getStatusCode()).body(bodyWithoutRefresh);
    }

    private TokenDTO finalizeTokenResponse(TokenDTO tokenDTO, HttpServletResponse response) {
        attachRefreshCookie(response, tokenDTO.refreshToken());

        return new TokenDTO(
                tokenDTO.authenticated(),
                tokenDTO.created(),
                tokenDTO.expiration(),
                tokenDTO.accessToken(),
                null
        );
    }

    private void attachRefreshCookie(HttpServletResponse response, String refreshToken) {
        ResponseCookie cookie = ResponseCookie.from(REFRESH_COOKIE_NAME, refreshToken)
                .httpOnly(true)
                .secure(cookieSecure)
                .path("/auth")
                .sameSite("Lax")
                .maxAge(Duration.ofHours(3))
                .build();

        response.addHeader(HttpHeaders.SET_COOKIE, cookie.toString());
    }}

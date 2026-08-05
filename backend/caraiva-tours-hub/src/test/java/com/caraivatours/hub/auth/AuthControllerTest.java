package com.caraivatours.hub.auth;

import com.caraivatours.hub.auth.controller.AuthController;
import com.caraivatours.hub.auth.dto.TokenDTO;
import jakarta.servlet.http.HttpServletResponse;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;

import static org.assertj.core.api.Assertions.assertThat;
import static org.mockito.Mockito.verifyNoInteractions;

@ExtendWith(MockitoExtension.class)
class AuthControllerTest {

    @Mock
    private AuthService authService;

    @Mock
    private HttpServletResponse response;

    @InjectMocks
    private AuthController authController;

    @Test
    void shouldReturnUnauthorizedWithoutCallingServiceWhenRefreshCookieIsMissing() {
        ResponseEntity<TokenDTO> result = authController.refresh(null, response);

        assertThat(result.getStatusCode()).isEqualTo(HttpStatus.UNAUTHORIZED);
        assertThat(result.getBody()).isNull();
        verifyNoInteractions(authService, response);
    }
}

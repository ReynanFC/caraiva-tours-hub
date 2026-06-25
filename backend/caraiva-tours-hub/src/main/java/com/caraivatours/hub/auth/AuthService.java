package com.caraivatours.hub.auth;

import com.caraivatours.hub.auth.dto.AccountCredentialsDTO;
import com.caraivatours.hub.auth.dto.TokenDTO;
import com.caraivatours.hub.auth.jwt.JwtTokenProvider;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

@Service
public class AuthService {

    private final Logger logger = LoggerFactory.getLogger(AuthService.class);

    private final AuthenticationManager authenticationManager;
    private final UserService userService;
    private final JwtTokenProvider jwtTokenProvider;
    private final PasswordEncoder passwordEncoder;

    public AuthService(AuthenticationManager authenticationManager, UserService userService, JwtTokenProvider jwtTokenProvider, PasswordEncoder passwordEncoder) {
        this.authenticationManager = authenticationManager;
        this.userService = userService;
        this.jwtTokenProvider = jwtTokenProvider;
        this.passwordEncoder = passwordEncoder;
    }

    public ResponseEntity<TokenDTO> signIn(AccountCredentialsDTO credentials) {}

    public ResponseEntity<TokenDTO> refreshToken(String refreshToken) {}
}

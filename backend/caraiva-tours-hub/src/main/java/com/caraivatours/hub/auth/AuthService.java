package com.caraivatours.hub.auth;

import com.caraivatours.hub.auth.dto.AccountCredentialsDTO;
import com.caraivatours.hub.auth.dto.TokenDTO;
import com.caraivatours.hub.auth.entity.Permission;
import com.caraivatours.hub.auth.entity.enums.UserRole;
import com.caraivatours.hub.auth.jwt.JwtTokenProvider;
import com.caraivatours.hub.user.User;
import com.caraivatours.hub.user.UserService;
import lombok.AllArgsConstructor;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.AuthenticationException;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

@Service
@AllArgsConstructor
public class AuthService {

    private final Logger logger = LoggerFactory.getLogger(AuthService.class);

    private final AuthenticationManager authenticationManager;
    private final UserService userService;
    private final JwtTokenProvider jwtTokenProvider;
    private final PasswordEncoder passwordEncoder;

    public ResponseEntity<TokenDTO> signIn(AccountCredentialsDTO credentials) {
        try {
            Authentication authentication = authenticationManager.authenticate(
                    new UsernamePasswordAuthenticationToken(credentials.email(), credentials.password())
            );

            User user = (User) authentication.getPrincipal();

            UserRole role = user.getPermission().stream()
                    .findFirst().map(Permission::getRole).orElse(UserRole.EMPLOYEE);

            TokenDTO dto = jwtTokenProvider
                    .createAccessToken(
                            role,
                            user.getExternalUserId(),
                            user.getId()
                    );
            return ResponseEntity.ok().body(dto);

        } catch (AuthenticationException e) {
            throw new BadCredentialsException("Invalid username or password");
        }
    }

    public ResponseEntity<TokenDTO> refreshToken(String refreshToken) {

        TokenDTO tokenDTO = jwtTokenProvider.createRefreshToken(refreshToken);

       return ResponseEntity.ok().body(tokenDTO);
    }
}

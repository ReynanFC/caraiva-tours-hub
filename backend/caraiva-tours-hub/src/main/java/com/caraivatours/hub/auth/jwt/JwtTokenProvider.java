package com.caraivatours.hub.auth.jwt;

import com.auth0.jwt.JWT;
import com.auth0.jwt.JWTVerifier;
import com.auth0.jwt.algorithms.Algorithm;
import com.auth0.jwt.exceptions.JWTVerificationException;
import com.auth0.jwt.interfaces.DecodedJWT;
import com.caraivatours.hub.auth.dto.AuthenticatedUser;
import com.caraivatours.hub.auth.dto.TokenDTO;
import com.caraivatours.hub.auth.entity.enums.UserRole;
import com.caraivatours.hub.shared.exceptions.InvalidJwtAuthenticationException;
import com.caraivatours.hub.user.UserRepository;
import jakarta.annotation.PostConstruct;
import jakarta.servlet.http.HttpServletRequest;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.apache.catalina.realm.AuthenticatedUserRealm;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.stereotype.Service;
import org.springframework.util.StringUtils;
import org.springframework.web.servlet.support.ServletUriComponentsBuilder;

import java.time.Duration;
import java.time.Instant;
import java.util.Base64;
import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Slf4j
@Service
@RequiredArgsConstructor
public class JwtTokenProvider {

    private static final String CLAIM_USER_ID = "userId";
    private static final String CLAIM_ROLE = "role";
    private static final String CLAIM_TYPE = "type";
    private static final String TYPE_ACCESS = "access";
    private static final String TYPE_REFRESH = "refresh";
    private static final int TEMP_REFRESH = 3;
    private static final String BEARER_PREFIX = "Bearer ";

    @Value("${app.security.jwt.token.secret-key}")
    private String secretKey;

    @Value("${app.security.jwt.token.expire-length}")
    private long validityInMilliseconds;

    private final RefreshTokenStore tokenStore;

    private final UserRepository userRepository;

    private Algorithm algorithm;
    private JWTVerifier verifier;

    @PostConstruct
    protected void init() {
        byte[] encodedKey = Base64.getEncoder().encode(secretKey.getBytes());
        this.algorithm = Algorithm.HMAC256(encodedKey);
        this.verifier = JWT.require(algorithm).build();

        log.debug("JwtTokenProvider initialized. Access token validity: {} ms", validityInMilliseconds);
    }

    public TokenDTO createAccessToken(UserRole role, UUID uuid, Long id) {
        Instant now = Instant.now();
        Instant accessValidity = now.plusMillis(validityInMilliseconds);
        Instant refreshValidity = now.plusMillis(validityInMilliseconds * TEMP_REFRESH);
        Duration ttl = Duration.between(now, refreshValidity);

        String accessToken = generateAccessToken(role, now, accessValidity, uuid, id);
        String refreshToken = generateRefreshToken(role, now, refreshValidity, ttl, uuid, id);

        log.debug("Access/refresh token pair created for user {} with role {}", uuid, role);

        return new TokenDTO(true, now, accessValidity, accessToken, refreshToken);
    }

    public TokenDTO createRefreshToken(String refreshToken) {
        if (!StringUtils.hasText(refreshToken)) {
            log.warn("Refresh token request rejected: missing or malformed token");
            throw new InvalidJwtAuthenticationException("Refresh token is missing");
        }

        try {
            DecodedJWT decodedJWT = decodedToken(refreshToken);
            String tokenType = decodedJWT.getClaim(CLAIM_TYPE).asString();
            String jti = decodedJWT.getId();
            Long userId = decodedJWT.getClaim(CLAIM_USER_ID).asLong();

            validateRefreshTokenType(tokenType);
            verifyUserEnabled(userId);
            consumeRefreshToken(jti, userId);

            UUID uuid = UUID.fromString(decodedJWT.getSubject());
            UserRole role = UserRole.valueOf(decodedJWT.getClaim(CLAIM_ROLE).asString());

            log.debug("Refresh token validated for user {}, issuing new token pair", uuid);
            return createAccessToken(role, uuid, userId);

        } catch (JWTVerificationException e) {
            log.warn("Refresh token rejected: invalid or expired ({})", e.getClass().getSimpleName());
            throw new InvalidJwtAuthenticationException("Refresh token is invalid or expired");
        }
    }

    public Authentication getAuthenticationFromToken(String token) {
        DecodedJWT decodedJWT = decodedToken(token);
        validateAccessTokenType(decodedJWT.getClaim(CLAIM_TYPE).asString());

        UUID uuid = UUID.fromString(decodedJWT.getSubject());
        Long id = decodedJWT.getClaim(CLAIM_USER_ID).asLong();
        UserRole role = UserRole.valueOf(decodedJWT.getClaim(CLAIM_ROLE).asString());

        log.debug("Authentication resolved from token for user {} with role {}", uuid, role);

        List<SimpleGrantedAuthority> authorities = List.of(new SimpleGrantedAuthority(role.name()));

        return new UsernamePasswordAuthenticationToken(new AuthenticatedUser(uuid, id), "", authorities);
    }

    public Optional<String> resolveToken(HttpServletRequest request) {
        String bearerToken = request.getHeader("Authorization");

        if (!StringUtils.hasText(bearerToken) || !bearerToken.startsWith(BEARER_PREFIX)) {
            log.trace("No valid Bearer token found in request to {}", request.getRequestURI());
            return Optional.empty();
        }

        return Optional.of(bearerToken.substring(BEARER_PREFIX.length()));
    }

    private void verifyUserEnabled(Long userId) {
        boolean isEnabled = userRepository.findEnabledStatusById(userId).orElse(false);

        if (!isEnabled) {
            log.warn("Refresh token rejected: User ID {} is disabled or does not exist", userId);
            tokenStore.revokeAllForUser(userId);
            throw new InvalidJwtAuthenticationException("User account is disabled or inactive");
        }
    }

    private DecodedJWT decodedToken(String token) {
        try {
            return verifier.verify(token);
        } catch (JWTVerificationException e) {
            log.warn("Token verification failed: invalid or expired ({})", e.getClass().getSimpleName());
            throw new InvalidJwtAuthenticationException("Invalid or expired JWT token");
        }
    }

    private void validateRefreshTokenType(String tokenType) {
        if (!TYPE_REFRESH.equals(tokenType)) {
            throw new InvalidJwtAuthenticationException("Provided token is not a valid refresh token");
        }
    }

    private void validateAccessTokenType(String tokenType) {
        if (!TYPE_ACCESS.equals(tokenType)) {
            throw new InvalidJwtAuthenticationException("Provided token is not a valid access token");
        }
    }

    private void consumeRefreshToken(String jti, Long userId) {
        if (!tokenStore.consume(jti, userId)) {
            log.warn("Possible token reuse detected for user {}", userId);
            tokenStore.revokeAllForUser(userId);
            throw new InvalidJwtAuthenticationException("Refresh token already used");
        }
    }

    private String generateAccessToken(UserRole role, Instant now, Instant validity, UUID uuid, Long id) {
        String issuerUrl = ServletUriComponentsBuilder
                .fromCurrentContextPath()
                .build()
                .toUriString();

        return JWT.create()
                .withSubject(uuid.toString())
                .withClaim(CLAIM_USER_ID, id)
                .withClaim(CLAIM_ROLE, role.name())
                .withClaim(CLAIM_TYPE, TYPE_ACCESS)
                .withIssuedAt(now)
                .withExpiresAt(validity)
                .withIssuer(issuerUrl)
                .sign(algorithm);
    }

    private String generateRefreshToken(UserRole role, Instant now, Instant validity, Duration ttl, UUID uuid, Long id) {
        String generatedId = UUID.randomUUID().toString();

        String jwt = JWT.create()
                .withSubject(uuid.toString())
                .withJWTId(generatedId)
                .withClaim(CLAIM_USER_ID, id)
                .withClaim(CLAIM_ROLE, role.name())
                .withClaim(CLAIM_TYPE, TYPE_REFRESH)
                .withIssuedAt(now)
                .withExpiresAt(validity)
                .sign(algorithm);

        tokenStore.save(generatedId, id, ttl);
        return jwt;
    }
}

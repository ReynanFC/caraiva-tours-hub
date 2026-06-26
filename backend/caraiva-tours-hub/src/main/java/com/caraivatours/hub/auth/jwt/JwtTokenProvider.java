package com.caraivatours.hub.auth.jwt;

import com.auth0.jwt.JWT;
import com.auth0.jwt.JWTVerifier;
import com.auth0.jwt.algorithms.Algorithm;
import com.auth0.jwt.exceptions.JWTVerificationException;
import com.auth0.jwt.interfaces.DecodedJWT;
import com.caraivatours.hub.auth.dto.TokenDTO;
import com.caraivatours.hub.auth.entity.enums.UserRole;
import com.caraivatours.hub.shared.exceptions.InvalidJwtAuthenticationException;
import jakarta.annotation.PostConstruct;
import jakarta.servlet.http.HttpServletRequest;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.stereotype.Service;
import org.springframework.util.StringUtils;
import org.springframework.web.servlet.support.ServletUriComponentsBuilder;

import java.time.Instant;
import java.util.*;

@Service
public class JwtTokenProvider {

    private static final Logger logger = LoggerFactory.getLogger(JwtTokenProvider.class);

    private static final String CLAIM_USER_ID = "userId";
    private static final String CLAIM_ROLE = "role";
    private static final String CLAIM_TYPE = "type";
    private static final String TYPE_ACCESS = "access";
    private static final String TYPE_REFRESH = "refresh";
    private static final String BEARER_PREFIX = "Bearer ";

    @Value("${app.security.jwt.token.secret-key}")
    private String secretKey;

    @Value("${app.security.jwt.token.expire-length}")
    private long validityInMilliseconds;

    private Algorithm algorithm;

    @PostConstruct
    protected void init() {
        secretKey = Base64.getEncoder().encodeToString(secretKey.getBytes());
        algorithm = Algorithm.HMAC256(secretKey.getBytes());
        logger.debug("JwtTokenProvider initialized, access token validity: {} ms", validityInMilliseconds);
    }

    public TokenDTO createAccessToken(UserRole role, UUID uuid, Long id) {

        Instant now = Instant.now();
        Instant accessValidity = now.plusMillis(validityInMilliseconds);
        Instant refreshValidity = now.plusMillis(validityInMilliseconds * 3);

        String accessToken = getAccessToken(role, now, accessValidity, uuid, id);
        String refreshToken = getRefreshToken(role, now, refreshValidity, uuid, id);

        logger.debug("Access/refresh token pair created for user {} with role {}", uuid, role);

        return new TokenDTO(
                true,
                now,
                accessValidity,
                accessToken,
                refreshToken
        );
    }

    public TokenDTO createRefreshToken(String refreshToken) {
        if (!StringUtils.hasText(refreshToken)) {
            logger.warn("Refresh token request rejected: missing or malformed Authorization header");
            throw new InvalidJwtAuthenticationException("Refresh token is missing");
        }

        try {
            JWTVerifier verifier = JWT.require(algorithm).build();
            DecodedJWT decodedJWT = verifier.verify(refreshToken);

            String tokenType = decodedJWT.getClaim(CLAIM_TYPE).asString();
            if (!TYPE_REFRESH.equals(tokenType)) {
                logger.warn("Refresh attempt rejected: token type was '{}', expected '{}'", tokenType, TYPE_REFRESH);
                throw new InvalidJwtAuthenticationException("Provided token is not a refresh token");
            }

            UUID uuid = UUID.fromString(decodedJWT.getSubject());
            Long id = decodedJWT.getClaim(CLAIM_USER_ID).asLong();
            UserRole role = UserRole.valueOf(decodedJWT.getClaim(CLAIM_ROLE).asString());

            logger.debug("Refresh token validated for user {}, issuing new token pair", uuid);

            return createAccessToken(role, uuid, id);
        } catch (JWTVerificationException e) {
            logger.warn("Refresh token rejected: invalid or expired ({})", e.getClass().getSimpleName());
            throw new InvalidJwtAuthenticationException("Refresh token is invalid or expired");
        }
    }

    public Authentication getAuthenticationFromToken(String token) {
        DecodedJWT decodedJWT = decodedToken(token);

        UUID uuid = UUID.fromString(decodedJWT.getSubject());
        UserRole role = UserRole.valueOf(decodedJWT.getClaim(CLAIM_ROLE).asString());

        logger.debug("Authentication resolved from token for user {} with role {}", uuid, role);

        List<SimpleGrantedAuthority> authorities = List.of(new SimpleGrantedAuthority(role.name()));
        return new UsernamePasswordAuthenticationToken(uuid, "", authorities);
    }

    public Optional<String> resolveToken(HttpServletRequest request) {
        String bearerToken = request.getHeader("Authorization");

        if (!isValidBearerToken(bearerToken)) {
            logger.debug("No valid Bearer token found in request to {}", request.getRequestURI());
            return Optional.empty();
        }

        String cleanedToken = bearerToken.substring(BEARER_PREFIX.length());
        return Optional.of(cleanedToken);
    }

    public boolean validateToken(String token) {
        try {
            decodedToken(token);
            logger.debug("Token validation succeeded");
            return true;
        } catch (InvalidJwtAuthenticationException e) {
            return false;
        }
    }

    private DecodedJWT decodedToken(String token) {
        JWTVerifier verifier = JWT.require(algorithm).build();

        try {
            return verifier.verify(token);
        } catch (JWTVerificationException e) {
            logger.warn("Token verification failed: invalid or expired ({})", e.getClass().getSimpleName());
            throw new InvalidJwtAuthenticationException("Invalid or expired JWT token");
        }
    }

    private String getAccessToken(UserRole role, Instant now, Instant validity, UUID uuid, Long id) {
        String issuerUrl = ServletUriComponentsBuilder
                .fromCurrentContextPath().build().toUriString();

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

    private String getRefreshToken(UserRole role, Instant now, Instant validity, UUID uuid, Long id) {
        return JWT.create()
                .withSubject(uuid.toString())
                .withClaim(CLAIM_USER_ID, id)
                .withClaim(CLAIM_ROLE, role.name())
                .withClaim(CLAIM_TYPE, TYPE_REFRESH)
                .withIssuedAt(now)
                .withExpiresAt(validity)
                .sign(algorithm);
    }

    private boolean isValidBearerToken(String bearerToken) {
        return StringUtils.hasText(bearerToken) && bearerToken.startsWith(BEARER_PREFIX);
    }
}
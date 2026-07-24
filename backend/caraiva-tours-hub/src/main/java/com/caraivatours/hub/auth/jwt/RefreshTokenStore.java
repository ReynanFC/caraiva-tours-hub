package com.caraivatours.hub.auth.jwt;

import lombok.RequiredArgsConstructor;
import org.springframework.data.redis.core.StringRedisTemplate;
import org.springframework.stereotype.Service;

import java.time.Duration;
import java.util.Set;

/**
 * Manages refresh token lifecycle in Redis.
 *
 * <p>Each refresh token is stored as {@code refresh:{jti}} with a TTL.
 * A secondary set {@code user_tokens:{userId}} tracks all active JTIs per user,
 * enabling full session revocation on reuse detection.
 */
@Service
@RequiredArgsConstructor
public class RefreshTokenStore {

    private static final String REFRESH_TOKEN = "refresh:";
    private static final String USER_TOKENS = "user_tokens:";

    private final StringRedisTemplate redisTemplate;

    /**
     * Stores a refresh token JTI in Redis with TTL and registers it under the user's active token set.
     *
     * @param jti    unique JWT ID of the refresh token
     * @param userId owner of the token
     * @param ttl    time-to-live matching the refresh token expiration
     */
    public void save(String jti, Long userId, Duration ttl) {
        redisTemplate.opsForValue().set(REFRESH_TOKEN + jti, userId.toString(), ttl);
        redisTemplate.opsForSet().add(USER_TOKENS + userId, jti);
    }

    /**
     * Atomically consumes a refresh token JTI using Redis GETDEL.
     * Only the request that receives the stored owner can rotate the token.
     *
     * @param jti    unique JWT ID of the refresh token
     * @param userId expected owner of the token
     * @return true when the token existed and belonged to the expected user
     */
    public boolean consume(String jti, Long userId) {
        String storedUserId = redisTemplate.opsForValue().getAndDelete(REFRESH_TOKEN + jti);

        if (!userId.toString().equals(storedUserId)) {
            return false;
        }

        redisTemplate.opsForSet().remove(USER_TOKENS + userId, jti);
        return true;
    }

    /**
     * Revokes all active refresh tokens for a user. Called on reuse detection to force logout
     * across all sessions.
     *
     * @param userId target user
     */
    public void revokeAllForUser(Long userId) {
        Set<String> jtis = redisTemplate.opsForSet().members(USER_TOKENS + userId);
        if (jtis != null) {
            jtis.forEach(jti -> redisTemplate.delete(REFRESH_TOKEN + jti));
        }
        redisTemplate.delete(USER_TOKENS + userId);
    }
}

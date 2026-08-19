package com.caraivatours.hub.auth;

import com.caraivatours.hub.AbstractIntegrationTest;
import com.caraivatours.hub.auth.jwt.RefreshTokenStore;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.data.redis.connection.DataType;
import org.springframework.data.redis.core.StringRedisTemplate;
import org.springframework.test.context.ActiveProfiles;

import java.time.Duration;
import java.util.Set;
import java.util.concurrent.TimeUnit;

import static org.assertj.core.api.Assertions.assertThat;

@SpringBootTest
@ActiveProfiles("test")
class RefreshTokenStoreTest extends AbstractIntegrationTest {

    private static final Long USER_ID = 987_654L;
    private static final String USER_TOKENS_KEY = "user_tokens:" + USER_ID;

    @Autowired
    private RefreshTokenStore tokenStore;

    @Autowired
    private StringRedisTemplate redisTemplate;

    @BeforeEach
    void clearTokenFixtures() {
        redisTemplate.delete(Set.of(
                USER_TOKENS_KEY,
                "refresh:current-jti",
                "refresh:active-jti",
                "refresh:other-jti"
        ));
    }

    @Test
    void shouldStoreJtiAndExpireTheUserIndex() {
        Duration ttl = Duration.ofMinutes(15);

        tokenStore.save("current-jti", USER_ID, ttl);

        Long indexTtl = redisTemplate.getExpire(USER_TOKENS_KEY, TimeUnit.MILLISECONDS);

        assertThat(redisTemplate.type(USER_TOKENS_KEY)).isEqualTo(DataType.SET);
        assertThat(redisTemplate.opsForSet().members(USER_TOKENS_KEY))
                .containsExactly("current-jti");
        assertThat(indexTtl).isNotNull().isPositive().isLessThanOrEqualTo(ttl.toMillis());
    }

    @Test
    void shouldRenewUserIndexExpirationWhenSavingANewToken() {
        tokenStore.save("current-jti", USER_ID, Duration.ofMinutes(1));

        tokenStore.save("active-jti", USER_ID, Duration.ofMinutes(15));

        Long indexTtl = redisTemplate.getExpire(USER_TOKENS_KEY, TimeUnit.MINUTES);

        assertThat(redisTemplate.opsForSet().members(USER_TOKENS_KEY))
                .containsExactlyInAnyOrder("current-jti", "active-jti");
        assertThat(indexTtl).isNotNull().isBetween(14L, 15L);
    }

    @Test
    void shouldConsumeTokenAndRemoveItFromUserIndex() {
        tokenStore.save("current-jti", USER_ID, Duration.ofMinutes(15));

        boolean consumed = tokenStore.consume("current-jti", USER_ID);

        assertThat(consumed).isTrue();
        assertThat(redisTemplate.hasKey("refresh:current-jti")).isFalse();
        assertThat(redisTemplate.opsForSet().isMember(USER_TOKENS_KEY, "current-jti")).isFalse();
    }

    @Test
    void shouldRevokeAllTokensAndDeleteUserIndex() {
        tokenStore.save("current-jti", USER_ID, Duration.ofMinutes(15));
        tokenStore.save("other-jti", USER_ID, Duration.ofMinutes(15));

        tokenStore.revokeAllForUser(USER_ID);

        assertThat(redisTemplate.hasKey("refresh:current-jti")).isFalse();
        assertThat(redisTemplate.hasKey("refresh:other-jti")).isFalse();
        assertThat(redisTemplate.hasKey(USER_TOKENS_KEY)).isFalse();
    }
}

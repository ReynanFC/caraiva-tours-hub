package com.caraivatours.hub.ratelimit;

import io.github.bucket4j.Bandwidth;
import io.github.bucket4j.ConsumptionProbe;
import jakarta.servlet.FilterChain;
import org.junit.jupiter.params.ParameterizedTest;
import org.junit.jupiter.params.provider.ValueSource;
import org.springframework.http.HttpStatus;
import org.springframework.mock.web.MockHttpServletRequest;
import org.springframework.mock.web.MockHttpServletResponse;
import tools.jackson.databind.JsonNode;
import tools.jackson.databind.ObjectMapper;

import java.util.UUID;
import java.util.concurrent.atomic.AtomicBoolean;

import static org.assertj.core.api.Assertions.assertThat;

class RateLimitFilterTest {

    private final ObjectMapper objectMapper = new ObjectMapper();

    @ParameterizedTest
    @ValueSource(strings = {"/auth/signin", "/auth/forgot-password"})
    void shouldReturnRateLimitErrorWhenRequestLimitIsExceeded(String path) throws Exception {
        MockHttpServletRequest request = new MockHttpServletRequest("POST", path);
        request.setRemoteAddr("192.168.1.10");
        MockHttpServletResponse response = new MockHttpServletResponse();
        AtomicBoolean filterChainCalled = new AtomicBoolean(false);
        FilterChain filterChain = (servletRequest, servletResponse) -> filterChainCalled.set(true);
        ConsumptionProbe rejectedProbe = ConsumptionProbe.rejected(0, 1_500_000_000L, 1_500_000_000L);
        RateLimitFilter filter = new RateLimitFilter(
                new FixedProbeRateLimiterService(rejectedProbe),
                objectMapper
        );

        filter.doFilterInternal(request, response, filterChain);

        JsonNode body = objectMapper.readTree(response.getContentAsByteArray());

        assertThat(response.getStatus()).isEqualTo(HttpStatus.TOO_MANY_REQUESTS.value());
        assertThat(response.getContentType()).isEqualTo("application/json");
        assertThat(response.getHeader("Retry-After")).isEqualTo("2");
        assertThat(body.get("timestamp").asText()).isNotBlank();
        assertThat(body.get("message").asText()).isEqualTo("Too many requests, try again later");
        assertThat(body.get("path").asText()).isEqualTo(path);
        assertThatCodeIsUuid(body.get("traceId").asText());
        assertThat(body.get("retryAfterSeconds").asLong()).isEqualTo(2);
        assertThat(filterChainCalled).isFalse();
    }

    private void assertThatCodeIsUuid(String value) {
        assertThat(UUID.fromString(value)).isNotNull();
    }

    private static final class FixedProbeRateLimiterService extends RateLimiterService {

        private final ConsumptionProbe probe;

        private FixedProbeRateLimiterService(ConsumptionProbe probe) {
            super(null);
            this.probe = probe;
        }

        @Override
        public ConsumptionProbe tryConsume(String key, Bandwidth limit) {
            return probe;
        }
    }
}

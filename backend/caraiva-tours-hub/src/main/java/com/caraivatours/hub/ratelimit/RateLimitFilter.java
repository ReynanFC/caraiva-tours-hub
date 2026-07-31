package com.caraivatours.hub.ratelimit;

import com.caraivatours.hub.shared.exceptions.model.RateLimitError;
import io.github.bucket4j.Bandwidth;
import io.github.bucket4j.ConsumptionProbe;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;
import tools.jackson.databind.ObjectMapper;

import java.io.IOException;
import java.time.Duration;
import java.time.Instant;
import java.util.UUID;
import java.util.concurrent.TimeUnit;

@Component
@RequiredArgsConstructor
public class RateLimitFilter extends OncePerRequestFilter {

    private static final String SIGNIN_PATH = "/auth/signin";
    private static final String REFRESH_PATH = "/auth/refresh";
    private static final String RATE_LIMIT_MESSAGE = "Too many requests, try again later";

    private static final Bandwidth SIGNIN_LIMIT =
            Bandwidth.builder()
                    .capacity(5)
                    .refillIntervally(5, Duration.ofMinutes(5))
                    .build();

    private static final Bandwidth REFRESH_LIMIT =
            Bandwidth.builder()
                    .capacity(20)
                    .refillIntervally(20, Duration.ofMinutes(5))
                    .build();

    private final RateLimiterService rateLimiterService;
    private final ObjectMapper objectMapper;

    @Override
    protected void doFilterInternal(HttpServletRequest request,
                                    HttpServletResponse response,
                                    FilterChain filterChain) throws ServletException, IOException {

        String path = request.getRequestURI();
        Bandwidth limit = resolveLimit(path);

        if (limit == null) {
            filterChain.doFilter(request, response);
            return;
        }

        String ip = request.getRemoteAddr();
        String key = path + ":" + ip;

        ConsumptionProbe probe = rateLimiterService.tryConsume(key, limit);

        if (probe.isConsumed()) {
            filterChain.doFilter(request, response);
            return;
        }

        writeRateLimitResponse(response, path, probe);
    }

    private Bandwidth resolveLimit(String path) {
        return switch (path) {
            case SIGNIN_PATH -> SIGNIN_LIMIT;
            case REFRESH_PATH -> REFRESH_LIMIT;
            default -> null;
        };
    }

    private void writeRateLimitResponse(HttpServletResponse response,
                                        String path,
                                        ConsumptionProbe probe) throws IOException {
        long retryAfterSeconds = calculateRetryAfterSeconds(probe);

        configureResponse(response, retryAfterSeconds);
        objectMapper.writeValue(
                response.getOutputStream(),
                createRateLimitError(path, retryAfterSeconds)
        );
    }

    private void configureResponse(HttpServletResponse response, long retryAfterSeconds) {
        response.setStatus(HttpStatus.TOO_MANY_REQUESTS.value());
        response.setContentType("application/json");
        response.setHeader("Retry-After", String.valueOf(retryAfterSeconds));
    }

    /**
     * Calculates the number of seconds the client should wait before making
     * another request. The value is rounded up to avoid allowing a retry
     * before the bucket has been refilled.
     *
     * @param probe Bucket4j consumption result.
     * @return Seconds until the next request is allowed.
     */
    private long calculateRetryAfterSeconds(ConsumptionProbe probe) {
        long nanosToWait = probe.getNanosToWaitForRefill();
        long wholeSeconds = TimeUnit.NANOSECONDS.toSeconds(nanosToWait);

        return nanosToWait % TimeUnit.SECONDS.toNanos(1) == 0
                ? wholeSeconds
                : wholeSeconds + 1;
    }

    private RateLimitError createRateLimitError(String path, long retryAfterSeconds) {
        return new RateLimitError(
                Instant.now(),
                RATE_LIMIT_MESSAGE,
                path,
                UUID.randomUUID(),
                retryAfterSeconds
        );
    }
}

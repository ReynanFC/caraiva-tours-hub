package com.caraivatours.hub.ratelimit;

import io.github.bucket4j.Bandwidth;
import io.github.bucket4j.BucketConfiguration;
import io.github.bucket4j.ConsumptionProbe;
import io.github.bucket4j.distributed.ExpirationAfterWriteStrategy;
import io.github.bucket4j.distributed.proxy.ProxyManager;
import io.github.bucket4j.redis.lettuce.Bucket4jLettuce;
import io.lettuce.core.RedisClient;
import io.lettuce.core.api.StatefulRedisConnection;
import io.lettuce.core.codec.ByteArrayCodec;
import jakarta.annotation.PostConstruct;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.nio.charset.StandardCharsets;
import java.time.Duration;


/**
 * Creates distributed Bucket4j buckets backed by Redis.
 *
 * <p>Using Redis makes counters consistent across application instances. Bucket keys expire after
 * enough idle time to refill fully, avoiding permanent storage of IP-based counters.</p>
 */
@Service
@RequiredArgsConstructor
public class RateLimiterService {

    private final RedisClient redisClient;
    private ProxyManager<byte[]> proxyManager;

    @PostConstruct
    public void init() {
        StatefulRedisConnection<byte[], byte[]> connection =
                redisClient.connect(ByteArrayCodec.INSTANCE);

        proxyManager = Bucket4jLettuce.casBasedBuilder(connection)
                .expirationAfterWrite(
                        ExpirationAfterWriteStrategy.basedOnTimeForRefillingBucketUpToMax(
                                Duration.ofMinutes(10)))
                .build();
    }

    /**
     * @param key   unique identifier of the bucket (e.g. "signin:192.168.1.1")
     * @param limit the rule (capacity + refill strategy) for this bucket
     * @return true if the request is allowed, false if the rate limit has been exceeded
     */
    public ConsumptionProbe tryConsume(String key, Bandwidth limit) {
        byte[] keyBytes = key.getBytes(StandardCharsets.UTF_8);

        BucketConfiguration config = BucketConfiguration.builder()
                .addLimit(limit)
                .build();

        return proxyManager.builder()
                .build(keyBytes, () -> config)
                .tryConsumeAndReturnRemaining(1);

    }
}

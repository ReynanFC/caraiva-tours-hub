package com.caraivatours.hub.shared.config.cache;

import org.springframework.boot.cache.autoconfigure.RedisCacheManagerBuilderCustomizer;
import org.springframework.cache.annotation.EnableCaching;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.data.redis.cache.RedisCacheConfiguration;
import org.springframework.data.redis.serializer.RedisSerializationContext;
import org.springframework.data.redis.serializer.RedisSerializer;
import tools.jackson.databind.ObjectMapper;

import java.time.Duration;
import java.util.Map;

/**
 * Configures Redis-backed Spring caches with JSON values and bounded lifetimes.
 * Nulls are excluded to allow later database results to become visible, while volatile booking
 * and category-option views receive shorter TTLs than the ten-minute default.
 */
@Configuration
@EnableCaching
public class CacheConfig {

    private static final Map<String, Duration> CUSTOM_TTL = Map.of(
            "category-options", Duration.ofMinutes(2),
            "bookings", Duration.ofMinutes(2),
            "booking-details", Duration.ofMinutes(2)
    );

    private static final Duration DEFAULT_TTL = Duration.ofMinutes(10);

    @Bean
    public RedisCacheManagerBuilderCustomizer cacheManagerCustomizer(ObjectMapper objectMapper) {
        RedisCacheConfiguration base = baseConfig(objectMapper);

        return builder -> {
            builder.cacheDefaults(base.entryTtl(DEFAULT_TTL));
            CUSTOM_TTL.forEach((name, ttl) ->
                    builder.withCacheConfiguration(name, base.entryTtl(ttl)));
        };
    }

    private RedisCacheConfiguration baseConfig(ObjectMapper objectMapper) {
        return RedisCacheConfiguration.defaultCacheConfig()
                .serializeKeysWith(RedisSerializationContext.SerializationPair
                        .fromSerializer(RedisSerializer.string()))
                .serializeValuesWith(RedisSerializationContext.SerializationPair
                        .fromSerializer(RedisSerializer.json()))
                .disableCachingNullValues();
    }
}

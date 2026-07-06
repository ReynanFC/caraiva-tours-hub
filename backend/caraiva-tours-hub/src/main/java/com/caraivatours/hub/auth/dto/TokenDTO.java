package com.caraivatours.hub.auth.dto;

import java.time.Instant;
import java.util.UUID;

public record TokenDTO(
        boolean authenticated,
        Instant created,
        Instant expiration,
        String accessToken,
        String refreshToken
) {}

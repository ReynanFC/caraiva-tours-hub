package com.caraivatours.hub.auth.dto;

import java.time.Instant;
import java.util.UUID;

public record TokenDTO(

        Long userId,
        UUID externalUserId,
        boolean authenticated,
        Instant created,
        Instant expiration,
        String accessToken,
        String refreshToken
) {}

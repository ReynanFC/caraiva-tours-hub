package com.caraivatours.hub.client.dto.response;

import java.time.LocalDateTime;

public record ClientDetailsDTO(
        Long id,
        String name,
        String phone,
        String email,
        LocalDateTime createdAt
) {
}

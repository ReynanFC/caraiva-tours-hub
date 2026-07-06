package com.caraivatours.hub.user.dto.response;

import java.time.LocalDateTime;

public record UserProfileDTO(
        Long id,
        String userName,
        String fullName,
        String email,
        String pixKey,
        String role,
        LocalDateTime createdAt
) {}

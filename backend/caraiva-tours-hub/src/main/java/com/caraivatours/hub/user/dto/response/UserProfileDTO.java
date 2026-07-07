package com.caraivatours.hub.user.dto.response;

import com.caraivatours.hub.auth.entity.enums.UserRole;

import java.time.LocalDateTime;

public record UserProfileDTO(
        Long id,
        String userName,
        String fullName,
        String email,
        String pixKey,
        UserRole role,
        LocalDateTime createdAt
) {}

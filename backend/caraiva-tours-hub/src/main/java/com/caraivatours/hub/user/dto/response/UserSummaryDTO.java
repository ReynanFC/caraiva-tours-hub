package com.caraivatours.hub.user.dto.response;

import com.caraivatours.hub.auth.entity.enums.UserRole;

public record UserSummaryDTO(
    Long id,
    String userName,
    String email,
    UserRole role,
    boolean enabled
) {}


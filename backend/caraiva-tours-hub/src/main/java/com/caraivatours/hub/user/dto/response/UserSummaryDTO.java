package com.caraivatours.hub.user.dto.response;

public record UserSummaryDTO(
    Long id,
    String userName,
    String email,
    String role,
    boolean enabled
) {}


package com.caraivatours.hub.auth.dto;

import com.caraivatours.hub.auth.entity.enums.UserRole;

import java.time.Instant;
import java.util.UUID;

public record AuthenticatedUser(UUID uuid, Long id, UserRole role, Instant tokenExpiresAt) {
}

package com.caraivatours.hub.auth.dto;

import java.util.UUID;

public record AuthenticatedUser(UUID uuid, Long id) {
}

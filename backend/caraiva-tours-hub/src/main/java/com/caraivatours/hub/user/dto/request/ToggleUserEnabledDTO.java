package com.caraivatours.hub.user.dto.request;

import jakarta.validation.constraints.NotNull;

public record ToggleUserEnabledDTO(@NotNull Boolean enabled) {}

package com.caraivatours.hub.tour.dto.request;

import jakarta.validation.constraints.NotNull;

public record ToggleTourAvailabilityDTO(
        @NotNull(message = "Availability status is required")
        Boolean available
) {}

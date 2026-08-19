package com.caraivatours.hub.booking.dto.request;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

public record CancelBookingRequest(
        @NotBlank(message = "Cancellation reason is required")
        @Size(max = 255, message = "Cancellation reason must have at most 255 characters")
        String reason
) {
}

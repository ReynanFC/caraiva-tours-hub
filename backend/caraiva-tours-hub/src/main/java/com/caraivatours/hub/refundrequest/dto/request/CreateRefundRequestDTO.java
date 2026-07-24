package com.caraivatours.hub.refundrequest.dto.request;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;

public record CreateRefundRequestDTO(
        @NotNull(message = "Booking ID is required")
        Long bookingId,

        @NotBlank(message = "Refund reason is required")
        @Size(max = 255, message = "Refund reason must have at most 255 characters")
        String reason
) {
}

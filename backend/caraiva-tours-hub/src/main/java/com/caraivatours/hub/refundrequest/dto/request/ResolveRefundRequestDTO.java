package com.caraivatours.hub.refundrequest.dto.request;

import com.caraivatours.hub.refundrequest.enums.RefundStatus;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;

public record ResolveRefundRequestDTO(
        @NotNull(message = "Refund status is required")
        RefundStatus refundStatus,

        @Size(max = 255, message = "Admin observation must have at most 255 characters")
        String adminObservation
) {
}

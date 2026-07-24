package com.caraivatours.hub.refundrequest.dto.response;

import com.caraivatours.hub.refundrequest.enums.RefundStatus;

import java.time.LocalDateTime;

public record RefundRequestResponseDTO(
        Long id,
        String reason,
        String adminObservation,
        RefundStatus refundStatus,
        LocalDateTime requestedAt,
        LocalDateTime resolvedAt,
        Long bookingId,
        Long requestedByUserId,
        Long resolvedByUserId
) {
}

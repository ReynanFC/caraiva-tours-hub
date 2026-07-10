package com.caraivatours.hub.booking.statushistory.dto;

import com.caraivatours.hub.booking.enums.BookingStatus;

import java.time.LocalDateTime;

public record StatusHistoryDTO(
        BookingStatus previousStatus,
        BookingStatus newStatus,
        String changeReason,
        LocalDateTime changedAt,
        String changedByUserName
) {}

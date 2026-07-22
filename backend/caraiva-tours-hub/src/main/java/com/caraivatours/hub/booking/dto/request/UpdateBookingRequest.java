package com.caraivatours.hub.booking.dto.request;

import com.caraivatours.hub.groupmember.dto.GroupMemberDTO;
import jakarta.validation.Valid;
import jakarta.validation.constraints.DecimalMin;
import jakarta.validation.constraints.Future;
import jakarta.validation.constraints.Size;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.Set;

public record UpdateBookingRequest(
        @Size(max = 100, message = "Client name must not exceed 100 characters.")
        String clientName,

        @Size(max = 20, message = "Phone number must not exceed 20 characters.")
        String clientPhone,

        Long tourId,

        @Future(message = "Schedule date must be in the future.")
        LocalDateTime scheduleDate,

        Set<@Valid GroupMemberDTO> members,

        @DecimalMin(value = "0.00", message = "Manual discount cannot be negative.")
        BigDecimal manualDiscount
) {}

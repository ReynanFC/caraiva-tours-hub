package com.caraivatours.hub.booking.dto.request;

import com.caraivatours.hub.client.dto.ClientDTO;
import com.caraivatours.hub.groupmember.dto.GroupMemberDTO;
import com.caraivatours.hub.pickuplocation.dto.PickupDTO;
import jakarta.validation.Valid;
import jakarta.validation.constraints.DecimalMin;
import jakarta.validation.constraints.Future;
import jakarta.validation.constraints.NotNull;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;

public record CreateBookingRequest(
        @Valid
        @NotNull(message = "Client is required")
        ClientDTO client,

        List<@Valid GroupMemberDTO> members,

        @NotNull(message = "Tour ID is required")
        Long tourId,

        @NotNull(message = "Schedule date is required.")
        @Future(message = "Schedule date must be in the future.")
        LocalDateTime scheduleDate,

        @Valid
        @NotNull(message = "Pickup information is required.")
        PickupDTO pickup,

        @DecimalMin(value = "0.00", message = "Manual discount cannot be negative.")
        BigDecimal manualDiscount,

        String pixPaymentUrl
) {
        public CreateBookingRequest {
                if (members == null) {
                        members = List.of();
                }
                if (manualDiscount == null) {
                        manualDiscount = BigDecimal.ZERO;
                }
        }
}

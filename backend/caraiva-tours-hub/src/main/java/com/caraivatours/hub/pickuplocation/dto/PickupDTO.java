package com.caraivatours.hub.pickuplocation.dto;

import jakarta.validation.constraints.DecimalMin;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

import java.math.BigDecimal;

public record PickupDTO(
        @Size(max = 9, message = "ZIP code must not exceed 9 characters.")
        String cep,

        @NotBlank(message = "Pickup location name is required.")
        @Size(max = 150, message = "Pickup location name must not exceed 150 characters.")
        String locationName,

        @Size(max = 255, message = "Reference point must not exceed 255 characters.")
        String referencePoint,

        @DecimalMin(value = "0.00", message = "Pickup fee cannot be negative.")
        BigDecimal appliedPickupFee
) {}

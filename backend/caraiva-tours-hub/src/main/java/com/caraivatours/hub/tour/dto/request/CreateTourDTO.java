package com.caraivatours.hub.tour.dto.request;

import com.caraivatours.hub.shared.validation.ValueOfEnum;
import com.caraivatours.hub.tour.entity.enums.CommissionType;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.PositiveOrZero;
import jakarta.validation.constraints.Size;

import java.math.BigDecimal;
import java.time.Duration;

public record CreateTourDTO(

        @NotBlank(message = "Tour name is required")
        @Size(max = 150, message = "Tour name must not exceed 150 characters")
        String name,

        @NotBlank(message = "Description is required")
        String description,

        @NotNull(message = "Base price per person is required")
        @PositiveOrZero(message = "Base price must be zero or a positive value")
        BigDecimal basePricePerPerson,

        @PositiveOrZero(message = "Promotional price must be zero or a positive value")
        BigDecimal promoPricePerPerson,

        @ValueOfEnum(enumClass = CommissionType.class)
        CommissionType commissionType,

        @NotNull(message = "Commission value is required")
        @PositiveOrZero(message = "Commission value must be zero or a positive value")
        BigDecimal commissionValue,

        @NotNull(message = "Duration is required")
        Duration duration,

        @NotNull(message = "Availability status is required")
        Boolean available,

        @Size(max = 255, message = "Image URL must not exceed 255 characters")
        String imageUrl,

        @NotNull(message = "Combo status flag is required")
        Boolean isCombo,

        @NotNull(message = "Promotional status flag is required")
        Boolean isPromotional,

        @NotNull(message = "Category ID is required")
        Long categoryTourId
) {}

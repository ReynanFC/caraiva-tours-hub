package com.caraivatours.hub.tour.dto.response;

import com.caraivatours.hub.category.dto.response.CategoryOptionDTO;
import com.caraivatours.hub.tour.entity.enums.CommissionType;

import java.math.BigDecimal;
import java.time.Duration;

public record TourResponseDTO (
        Long id,
        String name,
        String description,
        BigDecimal basePricePerPerson,
        BigDecimal promoPricePerPerson,
        BigDecimal effectivePrice,
        CommissionType commissionType,
        BigDecimal commissionValue,
        Duration duration,
        boolean available,
        String imageUrl,
        boolean isPromotional,
        CategoryOptionDTO category
) {}

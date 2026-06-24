package com.caraivatours.hub.booking.embeddable;

import jakarta.persistence.Column;
import jakarta.persistence.Embeddable;

import java.math.BigDecimal;

@Embeddable
public record FinancialSnapshot(
        @Column(name = "unit_price_snapshot", precision = 10, scale = 2, nullable = false)
        BigDecimal unitPrice,

        @Column(name = "total_price_snapshot", precision = 10, scale = 2, nullable = false)
        BigDecimal totalPrice,

        @Column(name = "commission_snapshot", precision = 10, scale = 2, nullable = false)
        BigDecimal commissionValue,

        @Column(name = "manual_discount", precision = 10, scale = 2, nullable = false)
        BigDecimal manualDiscount
) {}

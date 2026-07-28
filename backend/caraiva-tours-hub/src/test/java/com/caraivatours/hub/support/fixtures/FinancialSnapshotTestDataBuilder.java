package com.caraivatours.hub.support.fixtures;

import com.caraivatours.hub.booking.embeddable.FinancialSnapshot;

import java.math.BigDecimal;

public final class FinancialSnapshotTestDataBuilder {

    private BigDecimal unitPrice = new BigDecimal("250.00");
    private BigDecimal totalPrice = new BigDecimal("500.00");
    private BigDecimal commissionValue = new BigDecimal("50.00");
    private BigDecimal manualDiscount = BigDecimal.ZERO.setScale(2);

    private FinancialSnapshotTestDataBuilder() {
    }

    public static FinancialSnapshotTestDataBuilder aFinancialSnapshot() {
        return new FinancialSnapshotTestDataBuilder();
    }

    public FinancialSnapshot build() {
        return new FinancialSnapshot(unitPrice, totalPrice, commissionValue, manualDiscount);
    }
}

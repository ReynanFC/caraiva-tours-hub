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

    public FinancialSnapshotTestDataBuilder withUnitPrice(BigDecimal unitPrice) {
        this.unitPrice = unitPrice;
        return this;
    }

    public FinancialSnapshotTestDataBuilder withTotalPrice(BigDecimal totalPrice) {
        this.totalPrice = totalPrice;
        return this;
    }

    public FinancialSnapshotTestDataBuilder withCommissionValue(BigDecimal commissionValue) {
        this.commissionValue = commissionValue;
        return this;
    }

    public FinancialSnapshotTestDataBuilder withManualDiscount(BigDecimal manualDiscount) {
        this.manualDiscount = manualDiscount;
        return this;
    }

    public FinancialSnapshot build() {
        return new FinancialSnapshot(unitPrice, totalPrice, commissionValue, manualDiscount);
    }
}

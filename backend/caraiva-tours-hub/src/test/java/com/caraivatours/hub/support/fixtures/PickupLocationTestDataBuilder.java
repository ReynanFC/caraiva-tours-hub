package com.caraivatours.hub.support.fixtures;

import com.caraivatours.hub.pickuplocation.PickupLocation;

import java.math.BigDecimal;

public final class PickupLocationTestDataBuilder {

    private Long id;
    private String cep = "45810-000";
    private String locationName = "Praça da Igreja de Caraíva";
    private String referencePoint = "Ao lado da igreja";
    private BigDecimal appliedPickupFee = new BigDecimal("30.00");

    private PickupLocationTestDataBuilder() {
    }

    public static PickupLocationTestDataBuilder aPickupLocation() {
        return new PickupLocationTestDataBuilder();
    }

    public PickupLocationTestDataBuilder withId(Long id) {
        this.id = id;
        return this;
    }

    public PickupLocationTestDataBuilder withCep(String cep) {
        this.cep = cep;
        return this;
    }

    public PickupLocationTestDataBuilder withLocationName(String locationName) {
        this.locationName = locationName;
        return this;
    }

    public PickupLocationTestDataBuilder withReferencePoint(String referencePoint) {
        this.referencePoint = referencePoint;
        return this;
    }

    public PickupLocationTestDataBuilder withAppliedPickupFee(BigDecimal appliedPickupFee) {
        this.appliedPickupFee = appliedPickupFee;
        return this;
    }

    public PickupLocation build() {
        PickupLocation pickupLocation = new PickupLocation(
                cep,
                locationName,
                referencePoint,
                appliedPickupFee
        );
        pickupLocation.setId(id);
        return pickupLocation;
    }
}

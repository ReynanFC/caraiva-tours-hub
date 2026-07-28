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

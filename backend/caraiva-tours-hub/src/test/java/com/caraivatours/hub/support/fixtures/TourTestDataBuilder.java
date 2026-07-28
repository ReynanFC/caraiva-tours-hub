package com.caraivatours.hub.support.fixtures;

import com.caraivatours.hub.category.CategoryTour;
import com.caraivatours.hub.tour.entity.Tour;
import com.caraivatours.hub.tour.entity.enums.CommissionType;

import java.math.BigDecimal;
import java.time.Duration;

import static com.caraivatours.hub.support.fixtures.CategoryTourTestDataBuilder.aCategoryTour;

public final class TourTestDataBuilder {

    private Long id;
    private String name = "Passeio para Corumbau";
    private String description = "Passeio de barco saindo de Caraíva com destino a Corumbau.";
    private BigDecimal basePricePerPerson = new BigDecimal("250.00");
    private BigDecimal promoPricePerPerson = new BigDecimal("220.00");
    private CommissionType commissionType = CommissionType.PERCENTAGE;
    private BigDecimal commissionValue = new BigDecimal("10.00");
    private Duration duration = Duration.ofHours(8);
    private boolean available = true;
    private String imageUrl = "https://example.com/images/corumbau.jpg";
    private boolean promotional;
    private CategoryTour categoryTour = aCategoryTour().build();

    private TourTestDataBuilder() {
    }

    public static TourTestDataBuilder aTour() {
        return new TourTestDataBuilder();
    }

    public TourTestDataBuilder withId(Long id) {
        this.id = id;
        return this;
    }

    public TourTestDataBuilder withName(String name) {
        this.name = name;
        return this;
    }

    public TourTestDataBuilder withDescription(String description) {
        this.description = description;
        return this;
    }

    public TourTestDataBuilder withBasePrice(BigDecimal basePricePerPerson) {
        this.basePricePerPerson = basePricePerPerson;
        return this;
    }

    public TourTestDataBuilder withPromoPrice(BigDecimal promoPricePerPerson) {
        this.promoPricePerPerson = promoPricePerPerson;
        return this;
    }

    public TourTestDataBuilder withCommission(CommissionType type, BigDecimal value) {
        this.commissionType = type;
        this.commissionValue = value;
        return this;
    }

    public TourTestDataBuilder withDuration(Duration duration) {
        this.duration = duration;
        return this;
    }

    public TourTestDataBuilder available(boolean available) {
        this.available = available;
        return this;
    }

    public TourTestDataBuilder withImageUrl(String imageUrl) {
        this.imageUrl = imageUrl;
        return this;
    }

    public TourTestDataBuilder promotional(boolean promotional) {
        this.promotional = promotional;
        return this;
    }

    public TourTestDataBuilder withCategory(CategoryTour categoryTour) {
        this.categoryTour = categoryTour;
        return this;
    }

    public Tour build() {
        Tour tour = new Tour();
        tour.setId(id);
        tour.setName(name);
        tour.setDescription(description);
        tour.setBasePricePerPerson(basePricePerPerson);
        tour.setPromoPricePerPerson(promoPricePerPerson);
        tour.setCommissionType(commissionType);
        tour.setCommissionValue(commissionValue);
        tour.setDuration(duration);
        tour.setAvailable(available);
        tour.setImageUrl(imageUrl);
        tour.setPromotional(promotional);
        tour.setCategoryTour(categoryTour);
        return tour;
    }
}

package com.caraivatours.hub.support.fixtures;

import com.caraivatours.hub.category.CategoryTour;

public final class CategoryTourTestDataBuilder {

    private Long id;
    private String name = "Passeios de barco";

    private CategoryTourTestDataBuilder() {
    }

    public static CategoryTourTestDataBuilder aCategoryTour() {
        return new CategoryTourTestDataBuilder();
    }

    public CategoryTourTestDataBuilder withId(Long id) {
        this.id = id;
        return this;
    }

    public CategoryTourTestDataBuilder withName(String name) {
        this.name = name;
        return this;
    }

    public CategoryTour build() {
        CategoryTour category = new CategoryTour(name);
        category.setId(id);
        return category;
    }
}

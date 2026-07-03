package com.caraivatours.hub.category;

import com.caraivatours.hub.tour.entity.Tour;
import jakarta.persistence.*;

import java.io.Serial;
import java.io.Serializable;
import java.util.HashSet;
import java.util.Set;

@Entity
@Table(name = "category_tour")
public class CategoryTour implements Serializable {

    @Serial
    private static final long serialVersionUID = 1L;

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "category_id")
    private Long id;

    @Column(name = "name", unique = true, nullable = false, length = 100)
    private String name;

    @OneToMany(mappedBy = "categoryTour")
    private Set<Tour> tours = new HashSet<>();

    public CategoryTour() {}

    public CategoryTour(String name) {
        this.name = name;
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public void addTour(Tour tour) {
        this.tours.add(tour);
        tour.setCategoryTour(this);
    }

    public void removeTour(Tour tour) {
        this.tours.remove(tour);
        tour.setCategoryTour(null);
    }

    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (o == null || getClass() != o.getClass()) return false;
        CategoryTour that = (CategoryTour) o;
        return id != null && id.equals(that.id);
    }

    @Override
    public int hashCode() {
        return getClass().hashCode();
    }
}
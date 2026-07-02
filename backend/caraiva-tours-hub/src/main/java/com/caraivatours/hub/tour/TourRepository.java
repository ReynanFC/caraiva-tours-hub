package com.caraivatours.hub.tour;

import com.caraivatours.hub.tour.entity.Tour;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface TourRepository extends JpaRepository<Tour, Long> {

    boolean existsByCategoryTourId(Long categoryTourId);

    boolean existsByName(String name);
}

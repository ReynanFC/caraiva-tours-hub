package com.caraivatours.hub.tour;

import com.caraivatours.hub.tour.dto.response.TourResponseDTO;
import com.caraivatours.hub.tour.entity.Tour;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface TourRepository extends JpaRepository<Tour, Long> {

    @Modifying
    @Query("UPDATE Tour t SET t.available = :available WHERE t.id = :id")
    int updateAvailability(@Param("id") Long id, @Param("available") boolean available);

    @Query("""
        SELECT t FROM Tour t
                WHERE (:search IS NULL OR LOWER(:search) LIKE LOWER(CONCAT('%',:search,'%')))
    """)
    Page<Tour> findAll(@Param("search") String search, Pageable pageable);

    Optional<TourResponseDTO> findByName(String name);

    boolean existsByCategoryTourId(Long categoryTourId);

    boolean existsByName(String name);
}

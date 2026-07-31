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

    @Query(value = """
        SELECT t.*
        FROM tour t
        WHERE :search = ''
           OR to_tsvector(
                'portuguese',
                COALESCE(t.name, '')
              ) @@ websearch_to_tsquery('portuguese', :search)
        """,
        countQuery = """
        SELECT COUNT(*)
        FROM tour t
        WHERE :search = ''
           OR to_tsvector(
                'portuguese',
                COALESCE(t.name, '')
              ) @@ websearch_to_tsquery('portuguese', :search)
        """,
        nativeQuery = true)
    Page<Tour> findAll(@Param("search") String search, Pageable pageable);

    @Query("""
        SELECT new com.caraivatours.hub.tour.dto.response.TourResponseDTO(
            t.id,
            t.name,
            t.description,
            t.basePricePerPerson,
            t.promoPricePerPerson,
            CASE
                WHEN t.isPromotional = true THEN t.promoPricePerPerson
                ELSE t.basePricePerPerson
            END,
            t.commissionType,
            t.commissionValue,
            t.duration,
            t.available,
            t.imageUrl,
            t.isPromotional,
            new com.caraivatours.hub.category.dto.response.CategoryOptionDTO(
                t.categoryTour.id,
                t.categoryTour.name
            )
        )
        FROM Tour t
        WHERE t.name = :name
    """)
    Optional<TourResponseDTO> findByName(@Param("name") String name);

    boolean existsByCategoryTourId(Long categoryTourId);

    boolean existsByName(String name);
}

package com.caraivatours.hub.category;


import com.caraivatours.hub.category.dto.response.CategoryListItemDTO;
import com.caraivatours.hub.category.dto.response.CategoryOptionDTO;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;

import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;


@Repository
public interface CategoryTourRepository extends JpaRepository<CategoryTour, Long> {

    boolean existsByName(String name);

    @Query("""
            SELECT new com.caraivatours.hub.category.dto.response.CategoryOptionDTO(c.id, c.name)
            FROM CategoryTour c
            WHERE (:search IS NULL OR LOWER(c.name) LIKE LOWER(CONCAT('%', :search, '%')))
            ORDER BY c.name
            """)
    List<CategoryOptionDTO> findOptions(@Param("search") String search, Pageable limit);

    @Query(value = """
            SELECT new com.caraivatours.hub.category.dto.response.CategoryListItemDTO(
                c.id, c.name, COUNT(t)
            )
            FROM CategoryTour c
            LEFT JOIN c.tours t
            WHERE (:search IS NULL OR LOWER(c.name) LIKE LOWER(CONCAT('%', :search, '%')))
            GROUP BY c.id, c.name
            """,
            countQuery = """
            SELECT COUNT(c) FROM CategoryTour c
            WHERE (:search IS NULL OR LOWER(c.name) LIKE LOWER(CONCAT('%', :search, '%')))
            """)
    Page<CategoryListItemDTO> findAllWithTourCount(@Param("search") String search, Pageable pageable);
}

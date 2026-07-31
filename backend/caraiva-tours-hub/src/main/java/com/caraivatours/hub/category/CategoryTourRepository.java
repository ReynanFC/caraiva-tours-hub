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

    @Query(value = """
            SELECT c.category_id AS id, c.name
            FROM category_tour c
            WHERE :search IS NULL OR :search = ''
               OR to_tsvector('portuguese', COALESCE(c.name, ''))
                    @@ websearch_to_tsquery('portuguese', :search)
            ORDER BY c.name
            """, nativeQuery = true)
    List<CategoryOptionDTO> findOptions(@Param("search") String search, Pageable limit);

    @Query(value = """
            SELECT c.category_id AS id, c.name, COUNT(t.tour_id) AS "tourCount"
            FROM category_tour c
            LEFT JOIN tour t ON t.category_id = c.category_id
            WHERE :search IS NULL OR :search = ''
               OR to_tsvector('portuguese', COALESCE(c.name, ''))
                    @@ websearch_to_tsquery('portuguese', :search)
            GROUP BY c.category_id, c.name
            """,
            countQuery = """
            SELECT COUNT(*)
            FROM category_tour c
            WHERE :search IS NULL OR :search = ''
               OR to_tsvector('portuguese', COALESCE(c.name, ''))
                    @@ websearch_to_tsquery('portuguese', :search)
            """,
            nativeQuery = true)
    Page<CategoryListItemDTO> findAllWithTourCount(@Param("search") String search, Pageable pageable);
}

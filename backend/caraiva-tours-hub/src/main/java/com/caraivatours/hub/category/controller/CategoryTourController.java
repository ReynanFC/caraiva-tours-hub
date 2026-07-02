package com.caraivatours.hub.category.controller;

import com.caraivatours.hub.category.CategoryTourService;
import com.caraivatours.hub.category.dto.request.CreateCategoryDTO;
import com.caraivatours.hub.category.dto.request.UpdateCategoryDTO;
import com.caraivatours.hub.category.dto.response.CategoryListItemDTO;
import com.caraivatours.hub.category.dto.response.CategoryOptionDTO;
import com.caraivatours.hub.category.dto.response.CategoryResponseDTO;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.apache.coyote.BadRequestException;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.web.PageableDefault;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.servlet.support.ServletUriComponentsBuilder;

import java.net.URI;
import java.util.List;


@RestController
@RequestMapping("/api/categories")
@RequiredArgsConstructor
public class CategoryTourController {

    private final CategoryTourService categoryService;

    @GetMapping("/{id}")
    public ResponseEntity<CategoryResponseDTO> findById(@PathVariable Long id) {
        return ResponseEntity.ok(categoryService.findById(id));
    }

    @GetMapping("/options")
    public ResponseEntity<List<CategoryOptionDTO>> findOptions(
            @RequestParam(value = "search", required = false) String search) {

        return ResponseEntity.ok(categoryService.findOptions(search));
    }

    @GetMapping
    public ResponseEntity<Page<CategoryListItemDTO>> findAll(
            @RequestParam(value = "search", required = false) String search,
            @PageableDefault(size = 10, sort = "name") Pageable pageable) {

        return ResponseEntity.ok(categoryService.findAll(search, pageable));
    }

    @PostMapping
    public ResponseEntity<CategoryResponseDTO> addCategoryTour(
            @RequestBody @Valid CreateCategoryDTO dto) {

        CategoryResponseDTO response = categoryService.addCategoryTour(dto);

        URI uri = ServletUriComponentsBuilder
                .fromCurrentRequest()
                .path("/{id}")
                .buildAndExpand(response.id())
                .toUri();

        return ResponseEntity.created(uri).body(response);
    }

    @PutMapping("/{id}")
    public ResponseEntity<CategoryResponseDTO> updateCategoryTour(
            @PathVariable Long id, @RequestBody @Valid UpdateCategoryDTO dto) {

        return ResponseEntity.ok(categoryService.updateCategoryTour(id, dto));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteCategoryTour(@PathVariable Long id) {
        categoryService.deleteCategoryTour(id);

        return ResponseEntity.noContent().build();
    }
}

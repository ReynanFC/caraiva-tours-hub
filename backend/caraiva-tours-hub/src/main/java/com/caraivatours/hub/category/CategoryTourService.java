package com.caraivatours.hub.category;

import com.caraivatours.hub.category.dto.request.CreateCategoryDTO;
import com.caraivatours.hub.category.dto.request.UpdateCategoryDTO;
import com.caraivatours.hub.category.dto.response.CategoryListItemDTO;
import com.caraivatours.hub.category.dto.response.CategoryOptionDTO;
import com.caraivatours.hub.category.dto.response.CategoryResponseDTO;
import com.caraivatours.hub.shared.exceptions.EntityInUseException;
import com.caraivatours.hub.shared.exceptions.ResourceNotFoundException;
import com.caraivatours.hub.tour.TourRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.apache.coyote.BadRequestException;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@Transactional(readOnly = true)
@Slf4j
@RequiredArgsConstructor
public class CategoryTourService {

    private final CategoryTourRepository categoryRepository;
    private final TourRepository tourRepository;

    public CategoryResponseDTO findById(Long id) {
        log.info("Fetching category tour with ID: {}", id);

        CategoryTour entity = categoryRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Category tour not found"));

        log.debug("Category tour found - ID: {}, Name: {}", entity.getId(), entity.getName());
        return new CategoryResponseDTO(entity.getId(), entity.getName());
    }

    public List<CategoryOptionDTO> findOptions(String search) {
        log.info("Fetching category options with search term: '{}'", search);
        return categoryRepository.findOptions(search, PageRequest.of(0, 20));
    }

    public Page<CategoryListItemDTO> findAll(String search, Pageable pageable) {
        log.info("Fetching paginated categories with search term: '{}'", search);
        log.debug("Pagination details: {}", pageable);
        return categoryRepository.findAllWithTourCount(search, pageable);
    }

    @Transactional
    public CategoryResponseDTO addCategoryTour(CreateCategoryDTO categoryDTO) throws BadRequestException {
        log.info("Attempting to add a new category tour with name: '{}'", categoryDTO.name());

        if (categoryRepository.existsByName(categoryDTO.name())) {
            throw new BadRequestException("Category already exists");
        }

        CategoryTour entity = new CategoryTour(categoryDTO.name());
        log.debug("Entity instance created in memory: {}", entity);

        entity = categoryRepository.save(entity);
        log.info("Category tour added successfully with ID: {}", entity.getId());

        return new CategoryResponseDTO(entity.getId(), entity.getName());
    }

    @Transactional
    public CategoryResponseDTO updateCategoryTour(Long id, UpdateCategoryDTO updateCategoryDTO) {
        log.info("Attempting to update category tour with ID: {}", id);
        log.debug("Payload data received: {}", updateCategoryDTO);

        CategoryTour entity = categoryRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Category tour not found"));

        log.debug("Current entity state before update - ID: {}, Name: '{}'", entity.getId(), entity.getName());

        entity.setName(updateCategoryDTO.name());
        log.debug("Entity state updated in memory - New Name: '{}'", entity.getName());

        entity = categoryRepository.save(entity);
        log.info("Category tour with ID: {} updated successfully", id);

        return new CategoryResponseDTO(entity.getId(), entity.getName());
    }

    /**
     * @param id ID of the category to be deleted.
     *           Deletion is only allowed when the category is not associated with any tour.
     */
    @Transactional
    public void deleteCategoryTour(Long id) {
        log.info("Attempting to delete category tour with ID: {}", id);

        if (!categoryRepository.existsById(id)) {
            throw new ResourceNotFoundException("Category tour not found");
        }

        log.debug("Checking if category tour with ID: {} is linked to any active tours", id);
        if (tourRepository.existsByCategoryTourId(id)) {
            log.debug("Deletion blocked: Category tour with ID: {} is currently linked to active tours", id);
            throw new EntityInUseException("Cannot delete category: it is linked to active tours");
        }

        categoryRepository.deleteById(id);
        log.info("Category tour with ID: {} deleted successfully", id);
    }
}
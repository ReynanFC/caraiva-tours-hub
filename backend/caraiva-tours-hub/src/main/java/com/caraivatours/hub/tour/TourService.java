package com.caraivatours.hub.tour;

import com.caraivatours.hub.category.CategoryTour;
import com.caraivatours.hub.category.CategoryTourService;
import com.caraivatours.hub.shared.dto.PagedResult;
import com.caraivatours.hub.shared.exceptions.BadRequestException;
import com.caraivatours.hub.shared.exceptions.ResourceNotFoundException;
import com.caraivatours.hub.tour.dto.request.CreateTourDTO;
import com.caraivatours.hub.tour.dto.request.ToggleTourAvailabilityDTO;
import com.caraivatours.hub.tour.dto.request.UpdateTourDTO;
import com.caraivatours.hub.tour.dto.response.TourResponseDTO;
import com.caraivatours.hub.tour.entity.Tour;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.cache.annotation.CacheEvict;
import org.springframework.cache.annotation.Cacheable;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@Transactional(readOnly = true)
@Slf4j
@RequiredArgsConstructor
public class TourService {

    private final TourRepository tourRepository;
    private final CategoryTourService categoryTourService;
    private final TourMapper mapper;

    public Tour findById(Long id) {
        return tourRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Tour not found with ID: " + id));
    }

    @Cacheable(value = "tours",
            key = "#search + '-' + #pageable.pageNumber + '-' + #pageable.pageSize + '-' + #pageable.sort",
            condition = "#search == null || #search.isEmpty()"
    )
    public PagedResult<TourResponseDTO> findAll(String search, Pageable pageable) {
        log.info("Fetching paginated tours list");
        log.debug("Pagination details: {}", pageable);

        Page<Tour> tours = tourRepository.findAll(search, pageable);

        log.debug("Database returned {} tours for the current page", tours.getNumberOfElements());

        return PagedResult.from(tours.map(mapper::toResponseDTO));
    }

    @Transactional
    @CacheEvict(value = {"tours", "categories"}, allEntries = true)
    public TourResponseDTO createTour(CreateTourDTO createTourDTO) {
        log.info("Attempting to add a new tour with name: '{}'", createTourDTO.name());
        log.debug("Payload data received: {}", createTourDTO);

        if (tourRepository.existsByName(createTourDTO.name())) {
            log.debug("Creation blocked: Tour with name '{}' already exists", createTourDTO.name());
            throw new BadRequestException("Tour already exists");
        }

        log.debug("Verifying category existence with ID: {}", createTourDTO.categoryTourId());
        CategoryTour category = categoryTourService.findEntityById(createTourDTO.categoryTourId());

        log.debug("Mapping CreateTourDTO to Tour entity state");
        Tour entity = mapper.toEntity(createTourDTO);

        log.debug("Synchronizing bidirectional relationship in memory via domain helper. Tour name: '{}', Category ID: {}", entity.getName(), category.getId());
        category.addTour(entity);

        entity = tourRepository.save(entity);
        log.info("Tour added successfully with ID: '{}' and mapped to Category ID: {}", entity.getId(), category.getId());

        return mapper.toResponseDTO(entity);
    }

    @Transactional
    @CacheEvict(value = {"tours", "categories"}, allEntries = true)
    public TourResponseDTO updateTour(Long id, UpdateTourDTO updateTourDTO) {
        log.info("Attempting to update tour with ID: {}", id);
        log.debug("Payload data received for update: {}", updateTourDTO);

        Tour entity = tourRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Tour not found with ID: " + id));

        log.debug("Current entity state before update - ID: {}, Name: '{}', Category ID: {}",
                entity.getId(), entity.getName(), entity.getCategoryTour().getId());

        if (hasCategoryChanged(entity, updateTourDTO)) {
            handleCategoryTransition(entity, updateTourDTO);
        }

        log.debug("Merging UpdateTourDTO fields into existing Tour entity");
        mapper.updateEntityFromDto(updateTourDTO, entity);

        entity = tourRepository.save(entity);
        log.info("Tour with ID: {} updated successfully", entity.getId());

        return mapper.toResponseDTO(entity);
    }

    private boolean hasCategoryChanged(Tour entity, UpdateTourDTO dto) {
        return !entity.getCategoryTour().getId().equals(dto.categoryTourId());
    }

    private void handleCategoryTransition(Tour entity, UpdateTourDTO dto) {
        log.debug("Category change detected. Unlinking tour ID: {} from old category ID: {}", entity.getId(), entity.getCategoryTour().getId());

        entity.getCategoryTour().removeTour(entity);

        CategoryTour newCategory = categoryTourService.findEntityById(dto.categoryTourId());
        newCategory.addTour(entity);
    }

    @Transactional
    @CacheEvict(value = {"tours", "categories"}, allEntries = true)
    public TourResponseDTO changeAvailable(Long id, ToggleTourAvailabilityDTO availabilityDTO) {
        log.info("Attempting to update availability status for tour with ID: {}", id);
        log.debug("Payload data received for availability change: {}", availabilityDTO);

        Tour entity = tourRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Tour not found with ID: " + id));

        log.debug("Current entity state before status update - ID: {}, Name: '{}', Current Availability: {}",
                entity.getId(), entity.getName(), entity.isAvailable());

        entity.setAvailable(availabilityDTO.available());
        log.debug("Entity state updated in memory - New Availability: {}", entity.isAvailable());

        entity = tourRepository.save(entity);
        log.info("Tour with ID: {} availability status updated successfully to: {}", entity.getId(), entity.isAvailable());

        return mapper.toResponseDTO(entity);
    }

    @Transactional
    @CacheEvict(value = {"tours", "categories"}, allEntries = true)
    public void deleteTour(Long id) {
        log.info("Attempting to delete tour with ID: {}", id);

        Tour tour = tourRepository.findById(id)
                        .orElseThrow(() -> new ResourceNotFoundException("Tour not found with ID: " + id));

        log.debug("Unlinking tour ID: {} from category ID: {} in memory", id, tour.getCategoryTour().getId());
        tour.getCategoryTour().removeTour(tour);

        tourRepository.deleteById(id);
        log.info("Tour with ID: {} deleted successfully", id);
    }
}

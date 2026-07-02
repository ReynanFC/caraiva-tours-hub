package com.caraivatours.hub.tour.controller;

import com.caraivatours.hub.shared.validation.IsAdmin;
import com.caraivatours.hub.tour.TourService;
import com.caraivatours.hub.tour.controller.docs.TourControllerDocs;
import com.caraivatours.hub.tour.dto.request.CreateTourDTO;
import com.caraivatours.hub.tour.dto.request.ToggleTourAvailabilityDTO;
import com.caraivatours.hub.tour.dto.request.UpdateTourDTO;
import com.caraivatours.hub.tour.dto.response.TourResponseDTO;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.web.PageableDefault;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.servlet.support.ServletUriComponentsBuilder;

import java.net.URI;

@RestController
@RequestMapping("/api/tours")
@RequiredArgsConstructor
public class TourController implements TourControllerDocs {

    private final TourService tourService;

    @GetMapping
    public ResponseEntity<Page<TourResponseDTO>> findAllTours(
            @RequestParam(value = "search", required = false, defaultValue = "") String search,
            @PageableDefault() Pageable pageable) {

       return ResponseEntity.ok(tourService.findAll(search.trim(), pageable));
    }

    @IsAdmin
    @PostMapping
    public ResponseEntity<TourResponseDTO> createTour(@RequestBody @Valid CreateTourDTO  dto) {

        TourResponseDTO response = tourService.createTour(dto);

        URI uri = ServletUriComponentsBuilder
                .fromCurrentRequest()
                .path("/{id}")
                .buildAndExpand(response.id())
                .toUri();

        return ResponseEntity.created(uri).body(response);
    }

    @IsAdmin
    @PutMapping("/{id}")
    public ResponseEntity<TourResponseDTO> updateTour(
            @PathVariable Long id, @RequestBody @Valid UpdateTourDTO dto) {

        return ResponseEntity.ok(tourService.updateTour(id, dto));
    }

    @IsAdmin
    @PatchMapping("/{id}")
    public ResponseEntity<TourResponseDTO> changeAvailable(
            @PathVariable Long id, @RequestBody @Valid ToggleTourAvailabilityDTO dto) {

        return ResponseEntity.ok(tourService.changeAvailable(id, dto));
    }

    @IsAdmin
    @DeleteMapping("{id}")
    public ResponseEntity<Void> deleteTour(@PathVariable Long id) {

        tourService.deleteTour(id);
        return ResponseEntity.noContent().build();
    }
}

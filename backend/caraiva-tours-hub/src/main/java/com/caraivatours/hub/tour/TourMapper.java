package com.caraivatours.hub.tour;


import com.caraivatours.hub.category.CategoryTour;
import com.caraivatours.hub.category.dto.response.CategoryOptionDTO;
import com.caraivatours.hub.tour.dto.request.CreateTourDTO;
import com.caraivatours.hub.tour.dto.request.UpdateTourDTO;
import com.caraivatours.hub.tour.dto.response.TourResponseDTO;
import com.caraivatours.hub.tour.entity.Tour;
import org.mapstruct.*;

@Mapper(
        componentModel = MappingConstants.ComponentModel.SPRING,
        unmappedTargetPolicy = ReportingPolicy.ERROR
)
public interface TourMapper {

    @Mapping(target = "category", source = "categoryTour")
    TourResponseDTO toResponseDTO(Tour tour);

    CategoryOptionDTO toCategoryOptionDTO(CategoryTour categoryTour);

    @Mapping(target = "id", ignore = true)
    @Mapping(target = "categoryTour", source = "categoryTourId", qualifiedByName = "idToCategoryTour")
    Tour toEntity(CreateTourDTO dto);

    @Mapping(target = "id", ignore = true)
    @Mapping(target = "categoryTour", source = "categoryTourId", qualifiedByName = "idToCategoryTour")
    Tour toEntity(UpdateTourDTO dto);

    @Named("idToCategoryTour")
    default CategoryTour idToCategoryTour(Long categoryTourId) {
        if (categoryTourId == null) {
            return null;
        }
        CategoryTour categoryTour = new CategoryTour();
        categoryTour.setId(categoryTourId);
        return categoryTour;
    }
}

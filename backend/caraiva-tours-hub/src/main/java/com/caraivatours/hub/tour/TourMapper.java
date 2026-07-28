package com.caraivatours.hub.tour;


import com.caraivatours.hub.category.CategoryTour;
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
    @Mapping(target = "isPromotional", source = "promotional")
    TourResponseDTO toResponseDTO(Tour tour);

    @Mapping(target = "id", ignore = true)
    @Mapping(target = "promotional", source = "isPromotional")
    @Mapping(target = "categoryTour", source = "categoryTourId", qualifiedByName = "idToCategoryTour")
    Tour toEntity(CreateTourDTO dto);

    @Mapping(target = "id", ignore = true)
    @Mapping(target = "promotional", source = "isPromotional")
    @Mapping(target = "categoryTour", ignore = true)
    void updateEntityFromDto(UpdateTourDTO dto, @MappingTarget Tour entity);

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

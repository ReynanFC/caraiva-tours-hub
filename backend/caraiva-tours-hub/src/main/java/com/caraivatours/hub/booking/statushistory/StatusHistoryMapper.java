package com.caraivatours.hub.booking.statushistory;

import com.caraivatours.hub.booking.statushistory.dto.StatusHistoryDTO;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.MappingConstants;
import org.mapstruct.ReportingPolicy;

@Mapper(componentModel = MappingConstants.ComponentModel.SPRING,
        unmappedTargetPolicy = ReportingPolicy.ERROR)
public interface StatusHistoryMapper {

    @Mapping(target = "changedByUserName", source = "changedBy.name")
    StatusHistoryDTO toDTO(StatusHistory statusHistory);
}

package com.caraivatours.hub.refundrequest;

import com.caraivatours.hub.refundrequest.dto.response.RefundRequestResponseDTO;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.MappingConstants;
import org.mapstruct.ReportingPolicy;

@Mapper(
        componentModel = MappingConstants.ComponentModel.SPRING,
        unmappedTargetPolicy = ReportingPolicy.ERROR
)
public interface RefundRequestMapper {

    @Mapping(target = "bookingId", source = "booking.id")
    @Mapping(target = "requestedByUserId", source = "requestedByUser.id")
    @Mapping(target = "resolvedByUserId", source = "resolvedByUser.id")
    RefundRequestResponseDTO toResponse(RefundRequest refundRequest);
}

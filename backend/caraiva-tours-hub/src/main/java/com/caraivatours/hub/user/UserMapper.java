package com.caraivatours.hub.user;

import com.caraivatours.hub.user.dto.request.UserRegistrationDTO;
import com.caraivatours.hub.user.dto.response.UserSummaryDTO;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.MappingConstants;
import org.mapstruct.ReportingPolicy;

@Mapper(
        componentModel = MappingConstants.ComponentModel.SPRING,
        unmappedTargetPolicy = ReportingPolicy.ERROR
)
public interface UserMapper {

    @Mapping(target = "id", ignore = true)
    @Mapping(target = "externalUserId", ignore = true)
    @Mapping(target = "password", ignore = true)
    @Mapping(target = "pixKey", ignore = true)
    @Mapping(target = "credentialsNonExpired", constant = "true")
    @Mapping(target = "permission", ignore = true)
    @Mapping(target = "bookings", ignore = true)
    @Mapping(target = "historyChange", ignore = true)
    @Mapping(target = "createdAt", ignore = true)
    User toEntity(UserRegistrationDTO dto);

    UserSummaryDTO toDTO(User user);
}

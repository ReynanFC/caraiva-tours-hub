package com.caraivatours.hub.user;

import com.caraivatours.hub.user.dto.request.UserRegistrationDTO;
import com.caraivatours.hub.user.dto.request.UserUpdateDTO;
import com.caraivatours.hub.user.dto.response.UserProfileDTO;
import com.caraivatours.hub.user.dto.response.UserSummaryDTO;
import org.mapstruct.*;

@Mapper(
        componentModel = MappingConstants.ComponentModel.SPRING,
        unmappedTargetPolicy = ReportingPolicy.ERROR,
        nullValuePropertyMappingStrategy = NullValuePropertyMappingStrategy.IGNORE
)
public interface UserMapper {

    @Mapping(target = "id", ignore = true)
    @Mapping(target = "externalUserId", ignore = true)
    @Mapping(target = "password", ignore = true)
    @Mapping(target = "pixKey", ignore = true)
    @Mapping(target = "permission", ignore = true)
    @Mapping(target = "bookings", ignore = true)
    @Mapping(target = "enabled", ignore = true)
    @Mapping(target = "historyChange", ignore = true)
    @Mapping(target = "authorities", ignore = true)
    @Mapping(target = "createdAt", ignore = true)
    User toEntity(UserRegistrationDTO dto);

    @Mapping(target = "role", expression = "java(user.getPermission().getFirst().getRole())")
    @Mapping(target = "userName", source = "username")
    UserSummaryDTO toDTO(User user);

    @Mapping(target = "role", expression = "java(user.getPermission().getFirst().getRole())")
    @Mapping(target = "userName", source = "username")
    UserProfileDTO toProfileDTO(User user);

    @Mapping(target = "id", ignore = true)
    @Mapping(target = "externalUserId", ignore = true)
    @Mapping(target = "password", ignore = true)
    @Mapping(target = "permission", ignore = true)
    @Mapping(target = "authorities", ignore = true)
    @Mapping(target = "bookings", ignore = true)
    @Mapping(target = "enabled", ignore = true)
    @Mapping(target = "historyChange", ignore = true)
    @Mapping(target = "createdAt", ignore = true)
    @Mapping(target = "fullName", ignore = true)
    void updateEntityFromDto(UserUpdateDTO dto, @MappingTarget User entity);
}

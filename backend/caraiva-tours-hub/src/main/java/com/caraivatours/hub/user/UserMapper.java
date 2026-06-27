package com.caraivatours.hub.user;

import com.caraivatours.hub.auth.entity.Permission;
import com.caraivatours.hub.user.dto.request.UserRegistrationDTO;
import com.caraivatours.hub.user.dto.response.UserSummaryDTO;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.MappingConstants;
import org.mapstruct.ReportingPolicy;

import java.util.List;

@Mapper(
        componentModel = MappingConstants.ComponentModel.SPRING,
        unmappedTargetPolicy = ReportingPolicy.ERROR
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
    @Mapping(target = "createdAt", ignore = true)
    User toEntity(UserRegistrationDTO dto);

    @Mapping(target = "userName", source = "username")
    @Mapping(target = "role", source = "permission")
    UserSummaryDTO toDTO(User user);

    default String mapPermissionsToRole(List<Permission> permissions) {
        if (permissions == null || permissions.isEmpty()) return null;
        return permissions.get(0).getRole().name();
    }
}

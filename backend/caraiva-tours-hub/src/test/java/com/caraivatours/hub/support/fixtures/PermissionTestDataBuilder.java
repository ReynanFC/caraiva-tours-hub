package com.caraivatours.hub.support.fixtures;

import com.caraivatours.hub.auth.entity.Permission;
import com.caraivatours.hub.auth.entity.enums.UserRole;

public final class PermissionTestDataBuilder {

    private Long id;
    private UserRole role = UserRole.EMPLOYEE;

    private PermissionTestDataBuilder() {
    }

    public static PermissionTestDataBuilder aPermission() {
        return new PermissionTestDataBuilder();
    }

    public PermissionTestDataBuilder withRole(UserRole role) {
        this.role = role;
        return this;
    }

    public Permission build() {
        Permission permission = new Permission(role);
        permission.setId(id);
        return permission;
    }
}

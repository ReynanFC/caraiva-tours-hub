package com.caraivatours.hub.support.fixtures;

import com.caraivatours.hub.auth.entity.Permission;
import com.caraivatours.hub.user.User;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.UUID;

import static com.caraivatours.hub.support.fixtures.PermissionTestDataBuilder.aPermission;

public final class UserTestDataBuilder {

    private Long id;
    private UUID externalUserId = UUID.fromString("2cc98dfb-b126-4ccd-b196-18a308a765f8");
    private String userName = "maria.silva";
    private String fullName = "Maria da Silva";
    private String email = "maria.silva@example.com";
    private String password = "$2a$10$test.password.hash";
    private String pixKey = "maria.silva@example.com";
    private boolean enabled = true;
    private LocalDateTime createdAt = LocalDateTime.of(2026, 1, 10, 9, 0);
    private final List<Permission> permissions = new ArrayList<>(List.of(aPermission().build()));

    private UserTestDataBuilder() {
    }

    public static UserTestDataBuilder aUser() {
        return new UserTestDataBuilder();
    }

    public User build() {
        User user = new User();
        user.setId(id);
        user.setExternalUserId(externalUserId);
        user.setUserName(userName);
        user.setFullName(fullName);
        user.setEmail(email);
        user.setPassword(password);
        user.setPixKey(pixKey);
        user.setEnabled(enabled);
        user.setCreatedAt(createdAt);
        permissions.forEach(user::addPermission);
        return user;
    }
}

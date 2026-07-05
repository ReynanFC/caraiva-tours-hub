package com.caraivatours.hub.auth;

import com.caraivatours.hub.auth.entity.Permission;
import com.caraivatours.hub.auth.entity.enums.UserRole;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface PermissionRepository extends JpaRepository<Permission, Long> {

    Optional<Permission> findByRole(UserRole role);
}

package com.caraivatours.hub.user;

import com.caraivatours.hub.user.dto.response.UserHeaderProjection;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface UserRepository extends JpaRepository<User, Long> {

    @Query("SELECT u.userName, p.role FROM User u JOIN u.permission p WHERE u.id = :id")
    UserHeaderProjection findHeaderDataById(@Param("id") Long id);

    Optional<User> findByEmail(String email);

    boolean existsByEmail(String email);
}

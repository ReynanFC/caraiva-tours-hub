package com.caraivatours.hub.user;

import com.caraivatours.hub.user.dto.response.UserHeaderProjection;
import com.caraivatours.hub.user.dto.response.UserSummaryDTO;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface UserRepository extends JpaRepository<User, Long> {

    @Query("""
        SELECT new com.caraivatours.hub.user.dto.response.UserSummaryDTO(
            u.id, u.userName, u.email, p.role, u.enabled
        )
        FROM User u
         JOIN u.permission p
            WHERE (:search = '' OR LOWER(u.userName) LIKE LOWER(CONCAT('%', :search, '%'))
                            OR LOWER(u.email) LIKE LOWER(CONCAT('%', :search, '%')))
    """)
    Page<UserSummaryDTO> findAll(@Param("search") String search, Pageable pageable);

    @Query("SELECT u.userName, p.role FROM User u JOIN u.permission p WHERE u.id = :id")
    Optional<UserHeaderProjection> findHeaderDataById(@Param("id") Long id);

    Optional<User> findByEmail(String email);

    boolean existsByEmail(String email);
}

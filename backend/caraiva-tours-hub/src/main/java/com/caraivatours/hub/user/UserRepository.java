package com.caraivatours.hub.user;

import com.caraivatours.hub.user.dto.response.UserHeaderProjection;
import com.caraivatours.hub.user.dto.response.UserSummaryProjection;
import org.springframework.data.domain.Page;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

@Repository
public interface UserRepository extends JpaRepository<User, Long> {

    @Query("SELECT u.userName, p.role FROM User u JOIN u.permission p WHERE u.id = :id")
    UserHeaderProjection findHeaderDataById(@Param("id") Long id);

}

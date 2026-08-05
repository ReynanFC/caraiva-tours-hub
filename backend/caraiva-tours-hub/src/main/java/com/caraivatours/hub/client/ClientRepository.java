package com.caraivatours.hub.client;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface ClientRepository extends JpaRepository<Client, Long> {

    boolean existsClientByEmail(String email);

    Optional<Client> findByPhone(String phone);

    boolean existsByPhoneAndIdNot(String phone, Long id);

}

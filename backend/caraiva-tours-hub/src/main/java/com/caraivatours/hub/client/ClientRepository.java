package com.caraivatours.hub.client;

import com.caraivatours.hub.client.dto.response.ClientTourHistoryDTO;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface ClientRepository extends JpaRepository<Client, Long> {

    Optional<Client> findByPhone(String phone);

    @Query("""
            SELECT new com.caraivatours.hub.client.dto.response.ClientTourHistoryDTO(
                b.id,
                b.tour.name,
                b.customSchedule,
                (SIZE(b.groupMembers) + 1),
                b.financialData.totalPrice,
                b.currentStatus
            )
            FROM Booking b
            WHERE b.client.id = :clientId
            """)
    Page<ClientTourHistoryDTO> findTourHistoryById(@Param("clientId") Long clientId, Pageable pageable);

}

package com.caraivatours.hub.pickuplocation;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface PickupLocationRepository extends JpaRepository<PickupLocation, Long> {
}

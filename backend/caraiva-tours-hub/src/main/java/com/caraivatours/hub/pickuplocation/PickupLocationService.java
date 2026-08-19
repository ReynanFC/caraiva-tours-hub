package com.caraivatours.hub.pickuplocation;

import com.caraivatours.hub.pickuplocation.dto.PickupDTO;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

/**
 * Creates the pickup snapshot attached to a booking.
 *
 * <p>The applied fee belongs to the reservation rather than to a global address catalog, which
 * preserves the amount negotiated at sale time.</p>
 */
@Service
@Slf4j
@RequiredArgsConstructor
public class PickupLocationService {

    private final PickupLocationRepository pickupRepository;

    @Transactional
    public PickupLocation createPickupLocation(PickupDTO dto) {
        log.debug("Processing pickup location. Postal Code: {}, Name: {}", dto.cep(), dto.locationName());

        PickupLocation pickup = new PickupLocation(
                dto.cep(), dto.locationName(), dto.referencePoint(), dto.appliedPickupFee()
        );

        return pickupRepository.save(pickup);
    }
}

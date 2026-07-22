package com.caraivatours.hub.pickuplocation;

import com.caraivatours.hub.pickuplocation.dto.PickupDTO;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@Slf4j
@RequiredArgsConstructor
public class PickupLocationService {

    private final PickupLocationRepository pickupRepository;

    @Transactional
    public PickupLocation createPickupLocation(PickupDTO dto) {
        log.debug("Processing pickup location. Postal Code: {}, Name: {}", dto.cep(), dto.locationName());

        return new PickupLocation(
                dto.cep(), dto.locationName(), dto.referencePoint(), dto.appliedPickupFee()
        );
    }
}

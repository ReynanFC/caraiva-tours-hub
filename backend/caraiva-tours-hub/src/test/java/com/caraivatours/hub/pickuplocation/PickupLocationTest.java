package com.caraivatours.hub.pickuplocation;

import com.caraivatours.hub.AbstractIntegrationTest;
import com.caraivatours.hub.pickuplocation.dto.PickupDTO;
import jakarta.persistence.EntityManager;
import jakarta.persistence.PersistenceContext;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Nested;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.dao.DataIntegrityViolationException;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;

import static com.caraivatours.hub.support.fixtures.PickupLocationTestDataBuilder.aPickupLocation;
import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;

@SpringBootTest
@ActiveProfiles("test")
@Transactional
@DisplayName("Pickup location integration tests")
class PickupLocationTest extends AbstractIntegrationTest {

    private static final long NON_EXISTENT_ID = 999_999L;

    @Autowired
    private PickupLocationRepository pickupRepository;

    @Autowired
    private PickupLocationService pickupService;

    @PersistenceContext
    private EntityManager entityManager;

    @Nested
    @DisplayName("PickupLocationRepository")
    class PickupLocationRepositoryTests {

        @Nested
        @DisplayName("Persistence")
        class PersistenceTests {

            @Test
            @DisplayName("should save and find a pickup location by id")
            void shouldSaveAndFindPickupLocationById() {
                PickupLocation saved = savePickup(aPickupLocation().build());
                entityManager.clear();

                assertThat(pickupRepository.findById(saved.getId()))
                        .isPresent()
                        .get()
                        .satisfies(pickup -> {
                            assertThat(pickup.getCep()).isEqualTo("45810-000");
                            assertThat(pickup.getLocationName()).isEqualTo("Praça da Igreja de Caraíva");
                            assertThat(pickup.getReferencePoint()).isEqualTo("Ao lado da igreja");
                            assertThat(pickup.getAppliedPickupFee()).isEqualByComparingTo("30.00");
                        });
            }

            @Test
            @DisplayName("should allow optional CEP and reference point to be null")
            void shouldAllowNullOptionalFields() {
                PickupLocation saved = savePickup(aPickupLocation()
                        .withCep(null)
                        .withReferencePoint(null)
                        .build());
                entityManager.clear();

                assertThat(pickupRepository.findById(saved.getId()))
                        .isPresent()
                        .get()
                        .satisfies(pickup -> {
                            assertThat(pickup.getCep()).isNull();
                            assertThat(pickup.getReferencePoint()).isNull();
                        });
            }

            @Test
            @DisplayName("should normalize a null pickup fee to zero")
            void shouldNormalizeNullFeeToZero() {
                PickupLocation saved = savePickup(aPickupLocation()
                        .withAppliedPickupFee(null)
                        .build());
                entityManager.clear();

                assertThat(pickupRepository.findById(saved.getId()))
                        .isPresent()
                        .get()
                        .extracting(PickupLocation::getAppliedPickupFee)
                        .isEqualTo(BigDecimal.ZERO.setScale(2));
            }

            @Test
            @DisplayName("should reject a pickup location without name")
            void shouldRejectPickupWithoutName() {
                assertThatThrownBy(() -> savePickup(aPickupLocation()
                        .withLocationName(null)
                        .build()))
                        .isInstanceOf(DataIntegrityViolationException.class);
            }
        }

        @Nested
        @DisplayName("findById")
        class FindByIdTests {

            @Test
            @DisplayName("should return empty when pickup location does not exist")
            void shouldReturnEmptyWhenPickupDoesNotExist() {
                assertThat(pickupRepository.findById(NON_EXISTENT_ID)).isEmpty();
            }
        }
    }

    @Nested
    @DisplayName("PickupLocationService")
    class PickupLocationServiceTests {

        @Nested
        @DisplayName("createPickupLocation")
        class CreatePickupLocationTests {

            @Test
            @DisplayName("should map and persist all pickup data")
            void shouldMapAndPersistPickupData() {
                PickupDTO request = new PickupDTO(
                        "45810-000",
                        "Praça da Igreja de Caraíva",
                        "Ao lado da igreja",
                        new BigDecimal("30.00")
                );

                PickupLocation result = pickupService.createPickupLocation(request);
                pickupRepository.flush();
                entityManager.clear();

                assertThat(result.getId()).isNotNull();
                assertThat(pickupRepository.findById(result.getId()))
                        .isPresent()
                        .get()
                        .satisfies(pickup -> {
                            assertThat(pickup.getCep()).isEqualTo(request.cep());
                            assertThat(pickup.getLocationName()).isEqualTo(request.locationName());
                            assertThat(pickup.getReferencePoint()).isEqualTo(request.referencePoint());
                            assertThat(pickup.getAppliedPickupFee())
                                    .isEqualByComparingTo(request.appliedPickupFee());
                        });
            }

            @Test
            @DisplayName("should persist optional fields as null and default fee to zero")
            void shouldPersistNullOptionalFieldsAndDefaultFee() {
                PickupLocation result = pickupService.createPickupLocation(new PickupDTO(
                        null,
                        "Centro de Caraíva",
                        null,
                        null
                ));
                pickupRepository.flush();
                entityManager.clear();

                assertThat(pickupRepository.findById(result.getId()))
                        .isPresent()
                        .get()
                        .satisfies(pickup -> {
                            assertThat(pickup.getCep()).isNull();
                            assertThat(pickup.getReferencePoint()).isNull();
                            assertThat(pickup.getAppliedPickupFee()).isEqualByComparingTo(BigDecimal.ZERO);
                        });
            }

            @Test
            @DisplayName("should persist a free pickup without changing its fee")
            void shouldPersistFreePickup() {
                PickupLocation result = pickupService.createPickupLocation(new PickupDTO(
                        "45810-000",
                        "Centro de Caraíva",
                        "Recepção",
                        BigDecimal.ZERO
                ));

                assertThat(result.getAppliedPickupFee()).isEqualByComparingTo(BigDecimal.ZERO);
                assertThat(result.getId()).isNotNull();
            }
        }
    }

    private PickupLocation savePickup(PickupLocation pickup) {
        pickup.setId(null);
        return pickupRepository.saveAndFlush(pickup);
    }
}

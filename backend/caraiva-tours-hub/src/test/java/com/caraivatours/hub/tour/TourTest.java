package com.caraivatours.hub.tour;

import com.caraivatours.hub.AbstractIntegrationTest;
import com.caraivatours.hub.category.CategoryTour;
import com.caraivatours.hub.category.CategoryTourRepository;
import com.caraivatours.hub.shared.dto.PagedResult;
import com.caraivatours.hub.shared.exceptions.BadRequestException;
import com.caraivatours.hub.shared.exceptions.ResourceNotFoundException;
import com.caraivatours.hub.tour.dto.request.CreateTourDTO;
import com.caraivatours.hub.tour.dto.request.ToggleTourAvailabilityDTO;
import com.caraivatours.hub.tour.dto.request.UpdateTourDTO;
import com.caraivatours.hub.tour.dto.response.TourResponseDTO;
import com.caraivatours.hub.tour.entity.Tour;
import com.caraivatours.hub.tour.entity.enums.CommissionType;
import jakarta.persistence.EntityManager;
import jakarta.persistence.PersistenceContext;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Nested;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Sort;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.time.Duration;

import static com.caraivatours.hub.support.fixtures.CategoryTourTestDataBuilder.aCategoryTour;
import static com.caraivatours.hub.support.fixtures.TourTestDataBuilder.aTour;
import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;

@SpringBootTest
@ActiveProfiles("test")
@Transactional
@DisplayName("Tour integration tests")
class TourTest extends AbstractIntegrationTest {

    private static final long NON_EXISTENT_ID = 999_999L;

    @Autowired
    private TourRepository tourRepository;

    @Autowired
    private TourService tourService;

    @Autowired
    private CategoryTourRepository categoryRepository;

    @PersistenceContext
    private EntityManager entityManager;

    @Nested
    @DisplayName("TourRepository")
    class TourRepositoryTests {

        @Nested
        @DisplayName("Persistence")
        class PersistenceTests {

            @Test
            @DisplayName("should save and find a tour by id")
            void shouldSaveAndFindTourById() {
                CategoryTour category = saveCategory("Passeios de barco");
                Tour savedTour = saveTour("Passeio para Corumbau", category);

                assertThat(tourRepository.findById(savedTour.getId()))
                        .isPresent()
                        .get()
                        .satisfies(tour -> {
                            assertThat(tour.getName()).isEqualTo("Passeio para Corumbau");
                            assertThat(tour.getCategoryTour().getId()).isEqualTo(category.getId());
                        });
            }

            @Test
            @DisplayName("should identify whether a tour name already exists")
            void shouldCheckIfTourNameExists() {
                CategoryTour category = saveCategory("Passeios de barco");
                saveTour("Passeio para Corumbau", category);

                assertThat(tourRepository.existsByName("Passeio para Corumbau")).isTrue();
                assertThat(tourRepository.existsByName("Passeio inexistente")).isFalse();
            }

            @Test
            @DisplayName("should identify whether a category has associated tours")
            void shouldCheckIfCategoryHasAssociatedTours() {
                CategoryTour categoryWithTour = saveCategory("Passeios de barco");
                CategoryTour categoryWithoutTour = saveCategory("Trilhas");
                saveTour("Passeio para Corumbau", categoryWithTour);

                assertThat(tourRepository.existsByCategoryTourId(categoryWithTour.getId())).isTrue();
                assertThat(tourRepository.existsByCategoryTourId(categoryWithoutTour.getId())).isFalse();
            }
        }

        @Nested
        @DisplayName("findByName")
        class FindByNameTests {

            @Test
            @DisplayName("should return the projected tour response")
            void shouldReturnProjectedTourResponse() {
                CategoryTour category = saveCategory("Passeios de barco");
                Tour tour = saveTour(aTour()
                        .withName("Passeio para Corumbau")
                        .withCategory(category)
                        .promotional(true)
                        .build());

                assertThat(tourRepository.findByName(tour.getName()))
                        .isPresent()
                        .get()
                        .satisfies(response -> {
                            assertThat(response.id()).isEqualTo(tour.getId());
                            assertThat(response.name()).isEqualTo(tour.getName());
                            assertThat(response.effectivePrice()).isEqualByComparingTo("220.00");
                            assertThat(response.category().id()).isEqualTo(category.getId());
                            assertThat(response.category().name()).isEqualTo(category.getName());
                        });
            }

            @Test
            @DisplayName("should return empty when tour name does not exist")
            void shouldReturnEmptyWhenTourNameDoesNotExist() {
                assertThat(tourRepository.findByName("Passeio inexistente")).isEmpty();
            }
        }

        @Nested
        @DisplayName("findAll")
        class FindAllTests {

            @Test
            @DisplayName("should filter tours by name ignoring case")
            void shouldFilterToursByNameIgnoringCase() {
                CategoryTour category = saveCategory("Passeios de barco");
                saveTour("Praia do Espelho", category);
                saveTour("Espelho e Trancoso", category);
                saveTour("Passeio para Corumbau", category);

                Page<Tour> result = tourRepository.findAll(
                        "ESPELHO",
                        null,
                        PageRequest.of(0, 10, Sort.by("name"))
                );

                assertThat(result.getTotalElements()).isEqualTo(2);
                assertThat(result.getContent())
                        .extracting(Tour::getName)
                        .containsExactly("Espelho e Trancoso", "Praia do Espelho");
            }

            @Test
            @DisplayName("should paginate and order all tours")
            void shouldPaginateAndOrderAllTours() {
                CategoryTour category = saveCategory("Passeios de barco");
                saveTour("Praia do Espelho", category);
                saveTour("Espelho e Trancoso", category);
                saveTour("Passeio para Corumbau", category);

                Page<Tour> result = tourRepository.findAll(
                        "",
                        null,
                        PageRequest.of(1, 1, Sort.by("name"))
                );

                assertThat(result.getTotalElements()).isEqualTo(3);
                assertThat(result.getTotalPages()).isEqualTo(3);
                assertThat(result.getNumber()).isEqualTo(1);
                assertThat(result.getContent())
                        .extracting(Tour::getName)
                        .containsExactly("Passeio para Corumbau");
            }

            @Test
            @DisplayName("should return an empty page when no tour matches")
            void shouldReturnEmptyPageWhenSearchDoesNotMatch() {
                CategoryTour category = saveCategory("Passeios de barco");
                saveTour("Passeio para Corumbau", category);

                Page<Tour> result = tourRepository.findAll(
                        "mergulho",
                        null,
                        PageRequest.of(0, 10)
                );

                assertThat(result).isEmpty();
                assertThat(result.getTotalElements()).isZero();
            }

            @Test
            @DisplayName("should filter tours by category")
            void shouldFilterToursByCategory() {
                CategoryTour boatTours = saveCategory("Passeios de barco");
                CategoryTour trails = saveCategory("Trilhas");
                saveTour("Passeio para Corumbau", boatTours);
                saveTour("Trilha do Descobrimento", trails);

                Page<Tour> result = tourRepository.findAll(
                        "",
                        trails.getId(),
                        PageRequest.of(0, 10, Sort.by("name"))
                );

                assertThat(result.getTotalElements()).isEqualTo(1);
                assertThat(result.getContent())
                        .extracting(Tour::getName)
                        .containsExactly("Trilha do Descobrimento");
            }
        }

        @Nested
        @DisplayName("updateAvailability")
        class UpdateAvailabilityTests {

            @Test
            @DisplayName("should update availability and return one affected row")
            void shouldUpdateTourAvailability() {
                CategoryTour category = saveCategory("Passeios de barco");
                Tour tour = saveTour(aTour()
                        .withName("Passeio para Corumbau")
                        .withCategory(category)
                        .available(false)
                        .build());

                int affectedRows = tourRepository.updateAvailability(tour.getId(), true);
                entityManager.flush();
                entityManager.clear();

                assertThat(affectedRows).isEqualTo(1);
                assertThat(tourRepository.findById(tour.getId()))
                        .isPresent()
                        .get()
                        .extracting(Tour::isAvailable)
                        .isEqualTo(true);
            }

            @Test
            @DisplayName("should return zero when updating a missing tour")
            void shouldReturnZeroWhenUpdatingMissingTour() {
                int affectedRows = tourRepository.updateAvailability(NON_EXISTENT_ID, false);

                assertThat(affectedRows).isZero();
            }
        }
    }

    @Nested
    @DisplayName("TourService")
    class TourServiceTests {

        @Nested
        @DisplayName("findById")
        class FindByIdTests {

            @Test
            @DisplayName("should return an existing tour")
            void shouldReturnExistingTour() {
                CategoryTour category = saveCategory("Passeios de barco");
                Tour tour = saveTour("Passeio para Corumbau", category);

                Tour result = tourService.findById(tour.getId());

                assertThat(result).isEqualTo(tour);
                assertThat(result.getName()).isEqualTo("Passeio para Corumbau");
            }

            @Test
            @DisplayName("should throw ResourceNotFoundException when tour does not exist")
            void shouldThrowWhenTourDoesNotExist() {
                assertThatThrownBy(() -> tourService.findById(NON_EXISTENT_ID))
                        .isInstanceOf(ResourceNotFoundException.class)
                        .hasMessage("Tour not found with ID: " + NON_EXISTENT_ID);
            }
        }

        @Nested
        @DisplayName("findAll")
        class FindAllTests {

            @Test
            @DisplayName("should return filtered paged tour responses")
            void shouldReturnFilteredPagedTourResponses() {
                CategoryTour category = saveCategory("Passeios de barco");
                Tour promotionalTour = saveTour(aTour()
                        .withName("Praia do Espelho")
                        .withCategory(category)
                        .promotional(true)
                        .build());
                saveTour("Passeio para Corumbau", category);

                PagedResult<TourResponseDTO> result = tourService.findAll(
                        "espelho",
                        null,
                        PageRequest.of(0, 10, Sort.by("name"))
                );

                assertThat(result.page()).isZero();
                assertThat(result.size()).isEqualTo(10);
                assertThat(result.totalElements()).isEqualTo(1);
                assertThat(result.totalPages()).isEqualTo(1);
                assertThat(result.content()).singleElement().satisfies(response -> {
                    assertThat(response.id()).isEqualTo(promotionalTour.getId());
                    assertThat(response.name()).isEqualTo("Praia do Espelho");
                    assertThat(response.effectivePrice()).isEqualByComparingTo("220.00");
                    assertThat(response.category().id()).isEqualTo(category.getId());
                    assertThat(response.category().name()).isEqualTo(category.getName());
                });
            }
        }

        @Nested
        @DisplayName("createTour")
        class CreateTourTests {

            @Test
            @DisplayName("should create a tour associated with an existing category")
            void shouldCreateTour() {
                CategoryTour category = saveCategory("Passeios de barco");

                TourResponseDTO result = tourService.createTour(createTourDTO(category.getId()));

                assertThat(result.id()).isNotNull();
                assertUpdatedTourResponse(
                        result,
                        category,
                        "Passeio para Trancoso",
                        "Passeio pelas praias de Trancoso",
                        true
                );
                assertThat(tourRepository.findById(result.id()))
                        .isPresent()
                        .get()
                        .satisfies(tour -> {
                            assertThat(tour.getName()).isEqualTo("Passeio para Trancoso");
                            assertThat(tour.getCategoryTour().getId()).isEqualTo(category.getId());
                            assertThat(tour.isPromotional()).isTrue();
                        });
            }

            @Test
            @DisplayName("should reject a duplicated tour name")
            void shouldRejectDuplicatedTourName() {
                CategoryTour category = saveCategory("Passeios de barco");
                saveTour("Passeio para Trancoso", category);

                assertThatThrownBy(() -> tourService.createTour(createTourDTO(category.getId())))
                        .isInstanceOf(BadRequestException.class)
                        .hasMessage("Tour already exists");

                assertThat(tourRepository.count()).isEqualTo(1);
            }

            @Test
            @DisplayName("should throw ResourceNotFoundException when category does not exist")
            void shouldThrowWhenCreatingWithMissingCategory() {
                assertThatThrownBy(() -> tourService.createTour(createTourDTO(NON_EXISTENT_ID)))
                        .isInstanceOf(ResourceNotFoundException.class)
                        .hasMessage("Category not found with ID: " + NON_EXISTENT_ID);

                assertThat(tourRepository.count()).isZero();
            }
        }

        @Nested
        @DisplayName("updateTour")
        class UpdateTourTests {

            @Test
            @DisplayName("should update every tour field while keeping its category")
            void shouldUpdateTourKeepingCategory() {
                CategoryTour category = saveCategory("Passeios de barco");
                Tour tour = saveTour("Nome antigo", category);

                TourResponseDTO result =
                        tourService.updateTour(tour.getId(), updateTourDTO(category.getId()));

                assertThat(result.id()).isEqualTo(tour.getId());
                assertUpdatedTourResponse(
                        result,
                        category,
                        "Passeio atualizado",
                        "Descrição atualizada",
                        false
                );
                assertThat(tourRepository.findById(tour.getId()))
                        .isPresent()
                        .get()
                        .satisfies(updatedTour -> {
                            assertThat(updatedTour.getName()).isEqualTo("Passeio atualizado");
                            assertThat(updatedTour.getDescription()).isEqualTo("Descrição atualizada");
                            assertThat(updatedTour.getBasePricePerPerson()).isEqualByComparingTo("300.00");
                            assertThat(updatedTour.getPromoPricePerPerson()).isEqualByComparingTo("250.00");
                            assertThat(updatedTour.getCommissionType()).isEqualTo(CommissionType.FIXED);
                            assertThat(updatedTour.getCommissionValue()).isEqualByComparingTo("35.00");
                            assertThat(updatedTour.getDuration()).isEqualTo(Duration.ofHours(6));
                            assertThat(updatedTour.isAvailable()).isFalse();
                            assertThat(updatedTour.getImageUrl()).isEqualTo("https://example.com/trancoso.jpg");
                            assertThat(updatedTour.isPromotional()).isTrue();
                            assertThat(updatedTour.getCategoryTour().getId()).isEqualTo(category.getId());
                        });
            }

            @Test
            @DisplayName("should move a tour to another category")
            void shouldMoveTourToAnotherCategory() {
                CategoryTour oldCategory = saveCategory("Passeios de barco");
                CategoryTour newCategory = saveCategory("Passeios terrestres");
                Tour tour = saveTour("Nome antigo", oldCategory);

                TourResponseDTO result =
                        tourService.updateTour(tour.getId(), updateTourDTO(newCategory.getId()));
                tourRepository.flush();

                assertThat(result.category().id()).isEqualTo(newCategory.getId());
                assertThat(result.category().name()).isEqualTo(newCategory.getName());
                assertThat(tourRepository.existsByCategoryTourId(oldCategory.getId())).isFalse();
                assertThat(tourRepository.existsByCategoryTourId(newCategory.getId())).isTrue();
            }

            @Test
            @DisplayName("should throw ResourceNotFoundException when updating a missing tour")
            void shouldThrowWhenUpdatingMissingTour() {
                CategoryTour category = saveCategory("Passeios de barco");

                assertThatThrownBy(() ->
                        tourService.updateTour(NON_EXISTENT_ID, updateTourDTO(category.getId())))
                        .isInstanceOf(ResourceNotFoundException.class)
                        .hasMessage("Tour not found with ID: " + NON_EXISTENT_ID);
            }

            @Test
            @DisplayName("should throw ResourceNotFoundException when new category does not exist")
            void shouldThrowWhenUpdatingToMissingCategory() {
                CategoryTour category = saveCategory("Passeios de barco");
                Tour tour = saveTour("Nome antigo", category);

                assertThatThrownBy(() ->
                        tourService.updateTour(tour.getId(), updateTourDTO(NON_EXISTENT_ID)))
                        .isInstanceOf(ResourceNotFoundException.class)
                        .hasMessage("Category not found with ID: " + NON_EXISTENT_ID);
            }
        }

        @Nested
        @DisplayName("changeAvailable")
        class ChangeAvailableTests {

            @Test
            @DisplayName("should change tour availability")
            void shouldChangeTourAvailability() {
                CategoryTour category = saveCategory("Passeios de barco");
                Tour tour = saveTour(aTour()
                        .withName("Passeio para Corumbau")
                        .withCategory(category)
                        .available(true)
                        .build());

                TourResponseDTO result =
                        tourService.changeAvailable(tour.getId(), new ToggleTourAvailabilityDTO(false));

                assertThat(result.id()).isEqualTo(tour.getId());
                assertThat(result.available()).isFalse();
                assertThat(tourRepository.findById(tour.getId()))
                        .isPresent()
                        .get()
                        .extracting(Tour::isAvailable)
                        .isEqualTo(false);
            }

            @Test
            @DisplayName("should throw ResourceNotFoundException when changing a missing tour")
            void shouldThrowWhenChangingMissingTour() {
                assertThatThrownBy(() ->
                        tourService.changeAvailable(
                                NON_EXISTENT_ID,
                                new ToggleTourAvailabilityDTO(false)
                        ))
                        .isInstanceOf(ResourceNotFoundException.class)
                        .hasMessage("Tour not found with ID: " + NON_EXISTENT_ID);
            }
        }

        @Nested
        @DisplayName("deleteTour")
        class DeleteTourTests {

            @Test
            @DisplayName("should delete an existing tour")
            void shouldDeleteTour() {
                CategoryTour category = saveCategory("Passeios de barco");
                Tour tour = saveTour("Passeio para Corumbau", category);

                tourService.deleteTour(tour.getId());

                assertThat(tourRepository.existsById(tour.getId())).isFalse();
                assertThat(categoryRepository.existsById(category.getId())).isTrue();
            }

            @Test
            @DisplayName("should throw ResourceNotFoundException when deleting a missing tour")
            void shouldThrowWhenDeletingMissingTour() {
                assertThatThrownBy(() -> tourService.deleteTour(NON_EXISTENT_ID))
                        .isInstanceOf(ResourceNotFoundException.class)
                        .hasMessage("Tour not found with ID: " + NON_EXISTENT_ID);
            }
        }
    }

    private CategoryTour saveCategory(String name) {
        return categoryRepository.saveAndFlush(aCategoryTour().withName(name).build());
    }

    private Tour saveTour(String name, CategoryTour category) {
        return saveTour(aTour().withName(name).withCategory(category).build());
    }

    private Tour saveTour(Tour tour) {
        return tourRepository.saveAndFlush(tour);
    }

    private CreateTourDTO createTourDTO(Long categoryId) {
        return new CreateTourDTO(
                "Passeio para Trancoso",
                "Passeio pelas praias de Trancoso",
                new BigDecimal("300.00"),
                new BigDecimal("250.00"),
                CommissionType.FIXED.name(),
                new BigDecimal("35.00"),
                Duration.ofHours(6),
                true,
                "https://example.com/trancoso.jpg",
                true,
                categoryId
        );
    }

    private UpdateTourDTO updateTourDTO(Long categoryId) {
        return new UpdateTourDTO(
                "Passeio atualizado",
                "Descrição atualizada",
                new BigDecimal("300.00"),
                new BigDecimal("250.00"),
                CommissionType.FIXED.name(),
                new BigDecimal("35.00"),
                Duration.ofHours(6),
                false,
                "https://example.com/trancoso.jpg",
                true,
                categoryId
        );
    }

    private void assertUpdatedTourResponse(
            TourResponseDTO response,
            CategoryTour category,
            String expectedName,
            String expectedDescription,
            boolean expectedAvailability
    ) {
        assertThat(response.name()).isEqualTo(expectedName);
        assertThat(response.description()).isEqualTo(expectedDescription);
        assertThat(response.basePricePerPerson()).isEqualByComparingTo("300.00");
        assertThat(response.promoPricePerPerson()).isEqualByComparingTo("250.00");
        assertThat(response.effectivePrice()).isEqualByComparingTo("250.00");
        assertThat(response.commissionType()).isEqualTo(CommissionType.FIXED);
        assertThat(response.commissionValue()).isEqualByComparingTo("35.00");
        assertThat(response.duration()).isEqualTo(Duration.ofHours(6));
        assertThat(response.available()).isEqualTo(expectedAvailability);
        assertThat(response.imageUrl()).isEqualTo("https://example.com/trancoso.jpg");
        assertThat(response.isPromotional()).isTrue();
        assertThat(response.category().id()).isEqualTo(category.getId());
        assertThat(response.category().name()).isEqualTo(category.getName());
    }
}

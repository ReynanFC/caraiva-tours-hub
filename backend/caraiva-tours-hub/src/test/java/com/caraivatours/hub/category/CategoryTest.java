package com.caraivatours.hub.category;

import com.caraivatours.hub.AbstractIntegrationTest;
import com.caraivatours.hub.category.dto.request.CreateCategoryDTO;
import com.caraivatours.hub.category.dto.request.UpdateCategoryDTO;
import com.caraivatours.hub.category.dto.response.CategoryListItemDTO;
import com.caraivatours.hub.category.dto.response.CategoryOptionDTO;
import com.caraivatours.hub.category.dto.response.CategoryResponseDTO;
import com.caraivatours.hub.shared.dto.PagedResult;
import com.caraivatours.hub.shared.exceptions.BadRequestException;
import com.caraivatours.hub.shared.exceptions.EntityInUseException;
import com.caraivatours.hub.shared.exceptions.ResourceNotFoundException;
import com.caraivatours.hub.tour.TourRepository;
import com.caraivatours.hub.tour.entity.Tour;
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

import java.util.List;
import java.util.stream.IntStream;

import static com.caraivatours.hub.support.fixtures.CategoryTourTestDataBuilder.aCategoryTour;
import static com.caraivatours.hub.support.fixtures.TourTestDataBuilder.aTour;
import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;

@SpringBootTest
@ActiveProfiles("test")
@Transactional
@DisplayName("Category integration tests")
class CategoryTest extends AbstractIntegrationTest {

    private static final long NON_EXISTENT_ID = 999_999L;

    @Autowired
    private CategoryTourRepository categoryRepository;

    @Autowired
    private CategoryTourService categoryService;

    @Autowired
    private TourRepository tourRepository;

    @Nested
    @DisplayName("CategoryTourRepository")
    class CategoryRepositoryTests {

        @Nested
        @DisplayName("Persistence")
        class PersistenceTests {

            @Test
            @DisplayName("should save and find a category by id")
            void shouldSaveAndFindCategoryById() {
                CategoryTour savedCategory = saveCategory("Passeios de barco");

                assertThat(categoryRepository.findById(savedCategory.getId()))
                        .isPresent()
                        .get()
                        .extracting(CategoryTour::getName)
                        .isEqualTo("Passeios de barco");
            }

            @Test
            @DisplayName("should identify whether a category name already exists")
            void shouldCheckIfCategoryNameExists() {
                saveCategory("Passeios terrestres");

                assertThat(categoryRepository.existsByName("Passeios terrestres")).isTrue();
                assertThat(categoryRepository.existsByName("Categoria inexistente")).isFalse();
            }
        }

        @Nested
        @DisplayName("findOptions")
        class FindOptionsTests {

            @Test
            @DisplayName("should return options ordered by name")
            void shouldReturnOptionsOrderedByName() {
                CategoryTour trilhas = saveCategory("Trilhas");
                CategoryTour barco = saveCategory("Barco");
                CategoryTour aventura = saveCategory("Aventura");

                List<CategoryOptionDTO> result =
                        categoryRepository.findOptions("", PageRequest.of(0, 20));

                assertThat(result)
                        .extracting(CategoryOptionDTO::id)
                        .containsExactly(aventura.getId(), barco.getId(), trilhas.getId());
                assertThat(result)
                        .extracting(CategoryOptionDTO::name)
                        .containsExactly("Aventura", "Barco", "Trilhas");
            }

            @Test
            @DisplayName("should filter options ignoring case")
            void shouldFilterOptionsIgnoringCase() {
                saveCategory("Passeio de Barco");
                saveCategory("Barco ao pôr do sol");
                saveCategory("Trilha ecológica");

                List<CategoryOptionDTO> result =
                        categoryRepository.findOptions("BARCO", PageRequest.of(0, 20));

                assertThat(result)
                        .extracting(CategoryOptionDTO::name)
                        .containsExactly("Barco ao pôr do sol", "Passeio de Barco");
            }

            @Test
            @DisplayName("should limit options to the requested page size")
            void shouldLimitOptionsToRequestedPageSize() {
                List<CategoryTour> categories = IntStream.rangeClosed(1, 21)
                        .mapToObj(index -> aCategoryTour()
                                .withName("Categoria %02d".formatted(index))
                                .build())
                        .toList();
                categoryRepository.saveAll(categories);
                categoryRepository.flush();

                List<CategoryOptionDTO> result =
                        categoryRepository.findOptions("", PageRequest.of(0, 20));

                assertThat(result).hasSize(20);
                assertThat(result.getFirst().name()).isEqualTo("Categoria 01");
                assertThat(result.getLast().name()).isEqualTo("Categoria 20");
            }

            @Test
            @DisplayName("should return an empty list when no option matches")
            void shouldReturnEmptyOptionsWhenSearchDoesNotMatch() {
                saveCategory("Passeios de barco");

                List<CategoryOptionDTO> result =
                        categoryRepository.findOptions("mergulho", PageRequest.of(0, 20));

                assertThat(result).isEmpty();
            }
        }

        @Nested
        @DisplayName("findAllWithTourCount")
        class FindAllWithTourCountTests {

            @Test
            @DisplayName("should return paged categories with their tour count")
            void shouldReturnPagedCategoriesWithTourCount() {
                CategoryTour barco = saveCategory("Barco");
                CategoryTour trilha = saveCategory("Trilha");
                saveTour("Corumbau", barco);
                saveTour("Espelho", barco);

                Page<CategoryListItemDTO> result = categoryRepository.findAllWithTourCount(
                        "",
                        PageRequest.of(0, 10, Sort.by("name"))
                );

                assertThat(result.getTotalElements()).isEqualTo(2);
                assertThat(result.getTotalPages()).isEqualTo(1);
                assertThat(result.getContent())
                        .extracting(CategoryListItemDTO::name, CategoryListItemDTO::tourCount)
                        .containsExactly(
                                org.assertj.core.groups.Tuple.tuple("Barco", 2L),
                                org.assertj.core.groups.Tuple.tuple("Trilha", 0L)
                        );
                assertThat(result.getContent())
                        .extracting(CategoryListItemDTO::id)
                        .containsExactly(barco.getId(), trilha.getId());
            }

            @Test
            @DisplayName("should filter and paginate categories")
            void shouldFilterAndPaginateCategories() {
                saveCategory("Passeio de Barco");
                saveCategory("Barco ao pôr do sol");
                saveCategory("Trilha ecológica");

                Page<CategoryListItemDTO> result = categoryRepository.findAllWithTourCount(
                        "BARCO",
                        PageRequest.of(1, 1, Sort.by("name"))
                );

                assertThat(result.getTotalElements()).isEqualTo(2);
                assertThat(result.getTotalPages()).isEqualTo(2);
                assertThat(result.getNumber()).isEqualTo(1);
                assertThat(result.getContent())
                        .extracting(CategoryListItemDTO::name)
                        .containsExactly("Passeio de Barco");
            }

            @Test
            @DisplayName("should return an empty page when no category matches")
            void shouldReturnEmptyPageWhenSearchDoesNotMatch() {
                saveCategory("Passeios de barco");

                Page<CategoryListItemDTO> result = categoryRepository.findAllWithTourCount(
                        "mergulho",
                        PageRequest.of(0, 10)
                );

                assertThat(result).isEmpty();
                assertThat(result.getTotalElements()).isZero();
            }
        }
    }

    @Nested
    @DisplayName("CategoryTourService")
    class CategoryServiceTests {

        @Nested
        @DisplayName("findEntityById and findById")
        class FindByIdTests {

            @Test
            @DisplayName("should return the persisted category entity")
            void shouldFindCategoryEntityById() {
                CategoryTour category = saveCategory("Passeios de barco");

                CategoryTour result = categoryService.findEntityById(category.getId());

                assertThat(result).isEqualTo(category);
                assertThat(result.getName()).isEqualTo("Passeios de barco");
            }

            @Test
            @DisplayName("should return the category response")
            void shouldFindCategoryResponseById() {
                CategoryTour category = saveCategory("Passeios de barco");

                CategoryResponseDTO result = categoryService.findById(category.getId());

                assertThat(result.id()).isEqualTo(category.getId());
                assertThat(result.name()).isEqualTo(category.getName());
            }

            @Test
            @DisplayName("should throw ResourceNotFoundException when category does not exist")
            void shouldThrowWhenCategoryDoesNotExist() {
                assertThatThrownBy(() -> categoryService.findById(NON_EXISTENT_ID))
                        .isInstanceOf(ResourceNotFoundException.class)
                        .hasMessage("Category not found with ID: " + NON_EXISTENT_ID);
            }
        }

        @Nested
        @DisplayName("findOptions")
        class FindOptionsTests {

            @Test
            @DisplayName("should return filtered category options")
            void shouldReturnFilteredCategoryOptions() {
                saveCategory("Passeio de Barco");
                saveCategory("Trilha ecológica");

                List<CategoryOptionDTO> result = categoryService.findOptions("barco");

                assertThat(result)
                        .extracting(CategoryOptionDTO::name)
                        .containsExactly("Passeio de Barco");
            }

            @Test
            @DisplayName("should return at most twenty options")
            void shouldReturnAtMostTwentyOptions() {
                categoryRepository.saveAll(IntStream.rangeClosed(1, 21)
                        .mapToObj(index -> aCategoryTour()
                                .withName("Categoria %02d".formatted(index))
                                .build())
                        .toList());
                categoryRepository.flush();

                List<CategoryOptionDTO> result = categoryService.findOptions("");

                assertThat(result).hasSize(20);
            }
        }

        @Nested
        @DisplayName("findAll")
        class FindAllTests {

            @Test
            @DisplayName("should return filtered paged categories with tour count")
            void shouldReturnFilteredPagedCategoriesWithTourCount() {
                CategoryTour barco = saveCategory("Passeio de Barco");
                saveCategory("Trilha ecológica");
                saveTour("Corumbau", barco);

                PagedResult<CategoryListItemDTO> result = categoryService.findAll(
                        "barco",
                        PageRequest.of(0, 1, Sort.by("name"))
                );

                assertThat(result.page()).isZero();
                assertThat(result.size()).isEqualTo(1);
                assertThat(result.totalElements()).isEqualTo(1);
                assertThat(result.totalPages()).isEqualTo(1);
                assertThat(result.content()).singleElement().satisfies(category -> {
                    assertThat(category.id()).isEqualTo(barco.getId());
                    assertThat(category.name()).isEqualTo("Passeio de Barco");
                    assertThat(category.tourCount()).isEqualTo(1);
                });
            }
        }

        @Nested
        @DisplayName("addCategoryTour")
        class AddCategoryTourTests {

            @Test
            @DisplayName("should add a new category")
            void shouldAddCategory() {
                CategoryResponseDTO result =
                        categoryService.addCategoryTour(new CreateCategoryDTO("Passeios de barco"));

                assertThat(result.id()).isNotNull();
                assertThat(result.name()).isEqualTo("Passeios de barco");
                assertThat(categoryRepository.findById(result.id()))
                        .isPresent()
                        .get()
                        .extracting(CategoryTour::getName)
                        .isEqualTo("Passeios de barco");
            }

            @Test
            @DisplayName("should reject a duplicated category name")
            void shouldRejectDuplicatedCategoryName() {
                saveCategory("Passeios de barco");

                assertThatThrownBy(() ->
                        categoryService.addCategoryTour(new CreateCategoryDTO("Passeios de barco")))
                        .isInstanceOf(BadRequestException.class)
                        .hasMessage("Category already exists");

                assertThat(categoryRepository.count()).isEqualTo(1);
            }
        }

        @Nested
        @DisplayName("updateCategoryTour")
        class UpdateCategoryTourTests {

            @Test
            @DisplayName("should update an existing category")
            void shouldUpdateCategory() {
                CategoryTour category = saveCategory("Nome antigo");

                CategoryResponseDTO result = categoryService.updateCategoryTour(
                        category.getId(),
                        new UpdateCategoryDTO("Nome atualizado")
                );

                assertThat(result.id()).isEqualTo(category.getId());
                assertThat(result.name()).isEqualTo("Nome atualizado");
                assertThat(categoryRepository.findById(category.getId()))
                        .isPresent()
                        .get()
                        .extracting(CategoryTour::getName)
                        .isEqualTo("Nome atualizado");
            }

            @Test
            @DisplayName("should throw ResourceNotFoundException when updating a missing category")
            void shouldThrowWhenUpdatingMissingCategory() {
                assertThatThrownBy(() -> categoryService.updateCategoryTour(
                        NON_EXISTENT_ID,
                        new UpdateCategoryDTO("Nome atualizado")
                ))
                        .isInstanceOf(ResourceNotFoundException.class)
                        .hasMessage("Category not found with ID: " + NON_EXISTENT_ID);
            }
        }

        @Nested
        @DisplayName("deleteCategoryTour")
        class DeleteCategoryTourTests {

            @Test
            @DisplayName("should delete a category without associated tours")
            void shouldDeleteCategoryWithoutTours() {
                CategoryTour category = saveCategory("Categoria sem passeios");

                categoryService.deleteCategoryTour(category.getId());

                assertThat(categoryRepository.existsById(category.getId())).isFalse();
            }

            @Test
            @DisplayName("should throw ResourceNotFoundException when deleting a missing category")
            void shouldThrowWhenDeletingMissingCategory() {
                assertThatThrownBy(() -> categoryService.deleteCategoryTour(NON_EXISTENT_ID))
                        .isInstanceOf(ResourceNotFoundException.class)
                        .hasMessage("Category tour not found");
            }

            @Test
            @DisplayName("should reject deletion when category has an associated tour")
            void shouldRejectDeletionWhenCategoryHasAssociatedTour() {
                CategoryTour category = saveCategory("Passeios de barco");
                saveTour("Corumbau", category);

                assertThatThrownBy(() -> categoryService.deleteCategoryTour(category.getId()))
                        .isInstanceOf(EntityInUseException.class)
                        .hasMessage("Cannot delete category: it is linked to active tours");

                assertThat(categoryRepository.existsById(category.getId())).isTrue();
            }
        }
    }

    private CategoryTour saveCategory(String name) {
        return categoryRepository.saveAndFlush(aCategoryTour().withName(name).build());
    }

    private Tour saveTour(String name, CategoryTour category) {
        return tourRepository.saveAndFlush(aTour()
                .withName(name)
                .withCategory(category)
                .build());
    }
}

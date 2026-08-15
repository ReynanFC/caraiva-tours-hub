package com.caraivatours.hub.booking;

import com.caraivatours.hub.AbstractIntegrationTest;
import com.caraivatours.hub.auth.PermissionRepository;
import com.caraivatours.hub.auth.entity.Permission;
import com.caraivatours.hub.booking.dto.request.CreateBookingRequest;
import com.caraivatours.hub.booking.dto.request.UpdateBookingRequest;
import com.caraivatours.hub.booking.dto.response.BookingDetailDTO;
import com.caraivatours.hub.booking.dto.response.BookingSummaryDTO;
import com.caraivatours.hub.booking.embeddable.FinancialSnapshot;
import com.caraivatours.hub.booking.enums.BookingStatus;
import com.caraivatours.hub.booking.statushistory.StatusHistoryRepository;
import com.caraivatours.hub.category.CategoryTour;
import com.caraivatours.hub.category.CategoryTourRepository;
import com.caraivatours.hub.client.Client;
import com.caraivatours.hub.client.ClientRepository;
import com.caraivatours.hub.client.dto.ClientDTO;
import com.caraivatours.hub.groupmember.GroupMember;
import com.caraivatours.hub.groupmember.dto.GroupMemberDTO;
import com.caraivatours.hub.payment.Payment;
import com.caraivatours.hub.payment.PaymentRepository;
import com.caraivatours.hub.pickuplocation.PickupLocation;
import com.caraivatours.hub.pickuplocation.PickupLocationRepository;
import com.caraivatours.hub.pickuplocation.PickupLocationService;
import com.caraivatours.hub.pickuplocation.dto.PickupDTO;
import com.caraivatours.hub.shared.dto.PagedResult;
import com.caraivatours.hub.shared.exceptions.BadRequestException;
import com.caraivatours.hub.shared.exceptions.ResourceNotFoundException;
import com.caraivatours.hub.tour.TourRepository;
import com.caraivatours.hub.tour.entity.Tour;
import com.caraivatours.hub.tour.entity.enums.CommissionType;
import com.caraivatours.hub.user.User;
import com.caraivatours.hub.user.UserRepository;
import jakarta.persistence.EntityManager;
import jakarta.persistence.PersistenceContext;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Nested;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.params.ParameterizedTest;
import org.junit.jupiter.params.provider.EnumSource;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Sort;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.test.context.bean.override.mockito.MockitoBean;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.Set;
import java.util.UUID;
import java.util.concurrent.atomic.AtomicInteger;

import static com.caraivatours.hub.support.fixtures.BookingTestDataBuilder.aBooking;
import static com.caraivatours.hub.support.fixtures.CategoryTourTestDataBuilder.aCategoryTour;
import static com.caraivatours.hub.support.fixtures.ClientTestDataBuilder.aClient;
import static com.caraivatours.hub.support.fixtures.PermissionTestDataBuilder.aPermission;
import static com.caraivatours.hub.support.fixtures.PickupLocationTestDataBuilder.aPickupLocation;
import static com.caraivatours.hub.support.fixtures.TourTestDataBuilder.aTour;
import static com.caraivatours.hub.support.fixtures.UserTestDataBuilder.aUser;
import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.when;

@SpringBootTest
@ActiveProfiles("test")
@Transactional
@DisplayName("Booking integration tests")
class BookingTest extends AbstractIntegrationTest {

    private static final long NON_EXISTENT_ID = 999_999L;
    private static final LocalDateTime SCHEDULE = LocalDateTime.of(2027, 2, 15, 8, 0);
    private static final AtomicInteger CLIENT_SEQUENCE = new AtomicInteger();

    @Autowired
    private BookingRepository bookingRepository;

    @Autowired
    private BookingService bookingService;

    @Autowired
    private CategoryTourRepository categoryRepository;

    @Autowired
    private TourRepository tourRepository;

    @Autowired
    private ClientRepository clientRepository;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private PermissionRepository permissionRepository;

    @Autowired
    private PickupLocationRepository pickupRepository;

    @Autowired
    private PaymentRepository paymentRepository;

    @Autowired
    private StatusHistoryRepository statusHistoryRepository;

    @MockitoBean
    private PickupLocationService pickupService;

    @PersistenceContext
    private EntityManager entityManager;

    @BeforeEach
    void persistPickupCreatedByBookingService() {
        when(pickupService.createPickupLocation(any(PickupDTO.class)))
                .thenAnswer(invocation -> {
                    PickupDTO dto = invocation.getArgument(0);
                    return pickupRepository.save(new PickupLocation(
                            dto.cep(),
                            dto.locationName(),
                            dto.referencePoint(),
                            dto.appliedPickupFee()
                    ));
                });
    }

    @Nested
    @DisplayName("BookingRepository")
    class BookingRepositoryTests {

        @Nested
        @DisplayName("Persistence")
        class PersistenceTests {

            @Test
            @DisplayName("should persist the booking snapshot and its relationships")
            void shouldPersistBookingAndRelationships() {
                Booking saved = saveBooking(BookingStatus.DRAFT, SCHEDULE, "Passeio para Corumbau");
                addMember(saved, "Pedro");
                bookingRepository.flush();
                entityManager.clear();

                assertThat(bookingRepository.findById(saved.getId()))
                        .isPresent()
                        .get()
                        .satisfies(booking -> {
                            assertThat(booking.getCurrentStatus()).isEqualTo(BookingStatus.DRAFT);
                            assertThat(booking.getFinancialData().unitPrice()).isEqualByComparingTo("250.00");
                            assertThat(booking.getTour().getName()).isEqualTo("Passeio para Corumbau");
                            assertThat(booking.getClient().getPhone()).startsWith("+55 73 9");
                            assertThat(booking.getAttendant().getId()).isNotNull();
                            assertThat(booking.getAttendant().isEnabled()).isTrue();
                            assertThat(booking.getPickupLocation().getAppliedPickupFee()).isEqualByComparingTo("30.00");
                            assertThat(booking.getGroupMembers()).extracting(GroupMember::getName).containsExactly("Pedro");
                        });
            }
        }

        @Nested
        @DisplayName("findExpiredDrafts")
        class FindExpiredDraftsTests {

            @Test
            @DisplayName("should return only drafts scheduled at or before the threshold")
            void shouldReturnOnlyExpiredDrafts() {
                LocalDateTime threshold = LocalDateTime.of(2027, 1, 10, 12, 0);
                Booking before = saveBooking(BookingStatus.DRAFT, threshold.minusMinutes(1), "Passeio vencido");
                Booking atThreshold = saveBooking(BookingStatus.DRAFT, threshold, "Passeio no limite");
                saveBooking(BookingStatus.DRAFT, threshold.plusMinutes(1), "Passeio futuro");
                saveBooking(BookingStatus.CONFIRMED, threshold.minusDays(1), "Passeio confirmado");

                assertThat(bookingRepository.findExpiredDrafts(BookingStatus.DRAFT, threshold))
                        .extracting(Booking::getId)
                        .containsExactlyInAnyOrder(before.getId(), atThreshold.getId());
            }
        }

        @Nested
        @DisplayName("findAll")
        class FindAllTests {

            @Test
            @DisplayName("should search by client phone or email ignoring case")
            void shouldSearchByPhoneOrEmail() {
                Booking first = saveBooking(
                        BookingStatus.DRAFT,
                        SCHEDULE,
                        "Passeio Corumbau",
                        "Ana",
                        "+55 73 98888-1001",
                        "ANA@EXAMPLE.COM"
                );
                Booking second = saveBooking(
                        BookingStatus.CONFIRMED,
                        SCHEDULE.plusDays(1),
                        "Passeio Espelho",
                        "Bruno",
                        "+55 73 97777-2002",
                        "bruno@example.com"
                );

                Page<BookingSummaryDTO> byPhone =
                        bookingRepository.findAll("8888-1001", PageRequest.of(0, 10));
                Page<BookingSummaryDTO> byEmail =
                        bookingRepository.findAll("BRUNO@EXAMPLE", PageRequest.of(0, 10));

                assertThat(byPhone.getContent()).extracting(BookingSummaryDTO::id).containsExactly(first.getId());
                assertThat(byEmail.getContent()).extracting(BookingSummaryDTO::id).containsExactly(second.getId());
            }

            @Test
            @DisplayName("should paginate all bookings when search is empty")
            void shouldPaginateAllBookingsWhenSearchIsEmpty() {
                saveBooking(BookingStatus.DRAFT, SCHEDULE, "Passeio B");
                saveBooking(BookingStatus.CONFIRMED, SCHEDULE.plusDays(1), "Passeio A");

                Page<BookingSummaryDTO> result = bookingRepository.findAll(
                        "",
                        PageRequest.of(0, 1, Sort.by("customSchedule"))
                );

                assertThat(result.getTotalElements()).isEqualTo(2);
                assertThat(result.getTotalPages()).isEqualTo(2);
                assertThat(result.getContent()).hasSize(1);
            }

            @Test
            @DisplayName("should return an empty page when no client matches")
            void shouldReturnEmptyPageWhenNoClientMatches() {
                saveBooking(BookingStatus.DRAFT, SCHEDULE, "Passeio Corumbau");

                assertThat(bookingRepository.findAll("cliente inexistente", PageRequest.of(0, 10)))
                        .isEmpty();
            }

            @Test
            @DisplayName("should combine client search and status filters")
            void shouldCombineSearchAndStatusFilters() {
                Booking matching = saveBooking(
                        BookingStatus.CONFIRMED,
                        SCHEDULE,
                        "Passeio confirmado",
                        "Ana",
                        "+55 73 98888-1001",
                        "ana@example.com"
                );
                saveBooking(
                        BookingStatus.DRAFT,
                        SCHEDULE.plusDays(1),
                        "Passeio rascunho",
                        "Outra Ana",
                        "+55 73 98888-1002",
                        "outra-ana@example.com"
                );
                saveBooking(
                        BookingStatus.CONFIRMED,
                        SCHEDULE.plusDays(2),
                        "Outro confirmado",
                        "Bruno",
                        "+55 73 97777-2002",
                        "bruno@example.com"
                );

                Page<BookingSummaryDTO> result = bookingRepository.findAllByStatus(
                        "98888",
                        BookingStatus.CONFIRMED,
                        PageRequest.of(0, 10)
                );

                assertThat(result.getContent()).extracting(BookingSummaryDTO::id)
                        .containsExactly(matching.getId());
            }
        }

        @Nested
        @DisplayName("findByCurrentStatus")
        class FindByCurrentStatusTests {

            @Test
            @DisplayName("should return only bookings in the requested status")
            void shouldFilterByCurrentStatus() {
                Booking draft = saveBooking(BookingStatus.DRAFT, SCHEDULE, "Passeio rascunho");
                saveBooking(BookingStatus.CONFIRMED, SCHEDULE.plusDays(1), "Passeio confirmado");

                Page<BookingSummaryDTO> result =
                        bookingRepository.findByCurrentStatus(BookingStatus.DRAFT, PageRequest.of(0, 10));

                assertThat(result.getContent()).extracting(BookingSummaryDTO::id).containsExactly(draft.getId());
                assertThat(result.getContent()).allMatch(item -> item.status() == BookingStatus.DRAFT);
            }
        }
    }

    @Nested
    @DisplayName("Booking business rules")
    class BookingBusinessRulesTests {

        @Nested
        @DisplayName("Financial calculation")
        class FinancialCalculationTests {

            @Test
            @DisplayName("should deduct the discount and add the pickup fee")
            void shouldDeductDiscountAndAddPickupFee() {
                Booking booking = aBooking().build();

                assertThat(booking.calculateTotalPrice()).isEqualByComparingTo("530.00");
            }

            @Test
            @DisplayName("should not add a fee when pickup is free")
            void shouldNotAddFeeWhenPickupIsFree() {
                Booking booking = aBooking().build();
                booking.getPickupLocation().setAppliedPickupFee(BigDecimal.ZERO);

                assertThat(booking.calculateTotalPrice()).isEqualByComparingTo("500.00");
            }

            @Test
            @DisplayName("should calculate and round the twenty percent deposit")
            void shouldCalculateAndRoundDeposit() {
                Booking booking = aBooking().build();
                booking.setFinancialData(new FinancialSnapshot(
                        new BigDecimal("100.00"),
                        new BigDecimal("101.03"),
                        new BigDecimal("10.00"),
                        BigDecimal.ZERO
                ));
                booking.getPickupLocation().setAppliedPickupFee(BigDecimal.ZERO);

                assertThat(booking.calculateRequiredDeposit()).isEqualByComparingTo("20.21");
            }

            @Test
            @DisplayName("should include the organizer in the participant count")
            void shouldIncludeOrganizerInParticipantCount() {
                assertThat(Booking.calculateTotalParticipants(0)).isEqualTo(1);
                assertThat(Booking.calculateTotalParticipants(4)).isEqualTo(5);
            }

            @Test
            @DisplayName("should calculate percentage commission for every participant")
            void shouldCalculatePercentageCommission() {
                Booking booking = aBooking().build();

                booking.updateFinancials(new BigDecimal("250.00"), 3, new BigDecimal("25.00"));

                assertThat(booking.getFinancialData().unitPrice()).isEqualByComparingTo("250.00");
                assertThat(booking.getFinancialData().totalPrice()).isEqualByComparingTo("750.00");
                assertThat(booking.getFinancialData().commissionValue()).isEqualByComparingTo("75.00");
                assertThat(booking.getFinancialData().manualDiscount()).isEqualByComparingTo("25.00");
            }

            @Test
            @DisplayName("should calculate fixed commission for every participant")
            void shouldCalculateFixedCommission() {
                Booking booking = aBooking().build();
                booking.getTour().setCommissionType(CommissionType.FIXED);
                booking.getTour().setCommissionValue(new BigDecimal("35.00"));

                booking.updateFinancials(new BigDecimal("250.00"), 3, BigDecimal.ZERO);

                assertThat(booking.getFinancialData().commissionValue()).isEqualByComparingTo("105.00");
            }
        }

        @Nested
        @DisplayName("Modification state")
        class ModificationStateTests {

            @ParameterizedTest(name = "should reject modification when status is {0}")
            @EnumSource(
                    value = BookingStatus.class,
                    names = {"COMPLETED", "CANCELLED", "CANCEL_REQUEST"}
            )
            void shouldRejectTerminalOrCancellationStatuses(BookingStatus status) {
                Booking booking = aBooking().build();
                booking.setCurrentStatus(status);

                assertThatThrownBy(booking::validateBookingStateForModification)
                        .isInstanceOf(BadRequestException.class)
                        .hasMessage("This Booking cannot be changed/accessed because its status is: " + status.name());
            }

            @ParameterizedTest(name = "should allow modification when status is {0}")
            @EnumSource(value = BookingStatus.class, names = {"DRAFT", "CONFIRMED"})
            void shouldAllowMutableStatuses(BookingStatus status) {
                Booking booking = aBooking().build();
                booking.setCurrentStatus(status);

                booking.validateBookingStateForModification();
            }
        }

        @Nested
        @DisplayName("Request defaults")
        class RequestDefaultsTests {

            @Test
            @DisplayName("should default missing members and discount on creation")
            void shouldApplyCreateRequestDefaults() {
                CreateBookingRequest request = new CreateBookingRequest(
                        clientDTO("Ana", "+55 73 98888-1001", "ana@example.com"),
                        null,
                        1L,
                        SCHEDULE,
                        pickupDTO(),
                        null,
                        null
                );

                assertThat(request.members()).isEmpty();
                assertThat(request.manualDiscount()).isEqualByComparingTo(BigDecimal.ZERO);
            }
        }
    }

    @Nested
    @DisplayName("BookingService")
    class BookingServiceTests {

        @Nested
        @DisplayName("Queries")
        class QueryTests {

            @Test
            @DisplayName("should find an existing booking by id")
            void shouldFindExistingBookingById() {
                Booking booking = saveBooking(BookingStatus.DRAFT, SCHEDULE, "Passeio Corumbau");

                assertThat(bookingService.findById(booking.getId())).isEqualTo(booking);
            }

            @Test
            @DisplayName("should throw ResourceNotFoundException when booking id does not exist")
            void shouldThrowWhenBookingIdDoesNotExist() {
                assertThatThrownBy(() -> bookingService.findById(NON_EXISTENT_ID))
                        .isInstanceOf(ResourceNotFoundException.class)
                        .hasMessage("Booking not found with ID: " + NON_EXISTENT_ID);
            }

            @Test
            @DisplayName("should return paged summaries matching the search")
            void shouldReturnPagedSummariesMatchingSearch() {
                Booking booking = saveBooking(
                        BookingStatus.DRAFT,
                        SCHEDULE,
                        "Passeio Corumbau",
                        "Ana",
                        "+55 73 98888-1001",
                        "ana@example.com"
                );
                saveBooking(
                        BookingStatus.CONFIRMED,
                        SCHEDULE.plusDays(1),
                        "Passeio Espelho",
                        "Bruno",
                        "+55 73 97777-2002",
                        "bruno@example.com"
                );

                PagedResult<BookingSummaryDTO> result =
                        bookingService.findAll("98888", null, PageRequest.of(0, 10));

                assertThat(result.totalElements()).isEqualTo(1);
                assertThat(result.content()).extracting(BookingSummaryDTO::id).containsExactly(booking.getId());
            }

            @Test
            @DisplayName("should return paged summaries for the selected status")
            void shouldReturnPagedSummariesForStatus() {
                Booking confirmed = saveBooking(BookingStatus.CONFIRMED, SCHEDULE, "Passeio confirmado");
                saveBooking(BookingStatus.DRAFT, SCHEDULE.plusDays(1), "Passeio rascunho");

                PagedResult<BookingSummaryDTO> result =
                        bookingService.findAll("", BookingStatus.CONFIRMED, PageRequest.of(0, 10));

                assertThat(result.totalElements()).isEqualTo(1);
                assertThat(result.content()).extracting(BookingSummaryDTO::id).containsExactly(confirmed.getId());
            }

            @Test
            @DisplayName("should return details with calculated total, members and commission")
            void shouldReturnBookingDetails() {
                Booking booking = saveBooking(BookingStatus.DRAFT, SCHEDULE, "Passeio detalhado");
                addMember(booking, "Pedro");
                bookingRepository.flush();

                BookingDetailDTO result = bookingService.findDetailsBooking(booking.getId());

                assertThat(result.summary().id()).isEqualTo(booking.getId());
                assertThat(result.summary().groupSize()).isEqualTo(2);
                assertThat(result.summary().totalPrice()).isEqualByComparingTo("530.00");
                assertThat(result.commissionEarned()).isEqualByComparingTo("50.00");
                assertThat(result.members()).extracting(GroupMemberDTO::name).containsExactly("Pedro");
            }

            @Test
            @DisplayName("should throw ResourceNotFoundException when booking details do not exist")
            void shouldThrowWhenBookingDetailsDoNotExist() {
                assertThatThrownBy(() -> bookingService.findDetailsBooking(NON_EXISTENT_ID))
                        .isInstanceOf(ResourceNotFoundException.class)
                        .hasMessage("Booking not found with id: " + NON_EXISTENT_ID);
            }
        }

        @Nested
        @DisplayName("createBooking")
        class CreateBookingTests {

            @Test
            @DisplayName("should create a draft without payment when PIX URL is absent")
            void shouldCreateDraftWithoutPayment() {
                User attendant = saveUser();
                Tour tour = saveTour("Passeio Corumbau");

                BookingSummaryDTO result = bookingService.createBooking(
                        attendant.getId(),
                        createRequest(tour.getId(), Set.of(), new BigDecimal("20.00"), null)
                );
                bookingRepository.flush();

                assertThat(result.status()).isEqualTo(BookingStatus.DRAFT);
                assertThat(result.groupSize()).isEqualTo(1);
                assertThat(result.totalPrice()).isEqualByComparingTo("260.00");
                assertThat(bookingRepository.findById(result.id()))
                        .isPresent()
                        .get()
                        .satisfies(booking -> {
                            assertThat(booking.getPayment()).isNull();
                            assertThat(booking.getFinancialData().totalPrice()).isEqualByComparingTo("250.00");
                            assertThat(booking.getFinancialData().manualDiscount()).isEqualByComparingTo("20.00");
                        });
                assertInitialHistory(result.id(), attendant.getId(), BookingStatus.DRAFT);
            }

            @Test
            @DisplayName("should treat a blank PIX URL as absent")
            void shouldTreatBlankPixUrlAsAbsent() {
                User attendant = saveUser();
                Tour tour = saveTour("Passeio Corumbau");

                BookingSummaryDTO result = bookingService.createBooking(
                        attendant.getId(),
                        createRequest(tour.getId(), Set.of(), BigDecimal.ZERO, "   ")
                );
                bookingRepository.flush();

                assertThat(result.status()).isEqualTo(BookingStatus.DRAFT);
                assertThat(paymentRepository.count()).isZero();
            }

            @Test
            @DisplayName("should create a confirmed booking and twenty percent payment when PIX URL is present")
            void shouldCreateConfirmedBookingAndPayment() {
                User attendant = saveUser();
                Tour tour = saveTour("Passeio Corumbau");

                BookingSummaryDTO result = bookingService.createBooking(
                        attendant.getId(),
                        createRequest(
                                tour.getId(),
                                Set.of(new GroupMemberDTO("Pedro", false)),
                                new BigDecimal("50.00"),
                                "https://example.com/pix/receipt"
                        )
                );
                bookingRepository.flush();
                entityManager.clear();

                assertThat(result.status()).isEqualTo(BookingStatus.CONFIRMED);
                assertThat(result.groupSize()).isEqualTo(2);
                assertThat(result.totalPrice()).isEqualByComparingTo("480.00");
                assertThat(bookingRepository.findById(result.id()))
                        .isPresent()
                        .get()
                        .satisfies(booking -> {
                            assertThat(booking.getPayment()).isNotNull();
                            assertThat(booking.getPayment().getExpectedAmount()).isEqualByComparingTo("96.00");
                            assertThat(booking.getPayment().getReceiptUrl())
                                    .isEqualTo("https://example.com/pix/receipt");
                            assertThat(booking.getGroupMembers())
                                    .extracting(GroupMember::getName)
                                    .containsExactly("Pedro");
                        });
                assertInitialHistory(result.id(), attendant.getId(), BookingStatus.CONFIRMED);
            }

            @Test
            @DisplayName("should reuse an existing client with the same phone")
            void shouldReuseExistingClient() {
                User attendant = saveUser();
                Tour tour = saveTour("Passeio Corumbau");
                Client existing = saveClient("Cliente original", "+55 73 98888-1001", "original@example.com");

                BookingSummaryDTO result = bookingService.createBooking(
                        attendant.getId(),
                        createRequest(tour.getId(), Set.of(), BigDecimal.ZERO, null)
                );

                assertThat(clientRepository.count()).isEqualTo(1);
                assertThat(bookingService.findById(result.id()).getClient().getId()).isEqualTo(existing.getId());
                assertThat(result.clientName()).isEqualTo("Cliente original");
            }

            @Test
            @DisplayName("should use the promotional tour price in the financial snapshot")
            void shouldUsePromotionalTourPrice() {
                User attendant = saveUser();
                Tour tour = saveTour("Passeio promocional", new BigDecimal("250.00"), true);

                BookingSummaryDTO result = bookingService.createBooking(
                        attendant.getId(),
                        createRequest(tour.getId(), Set.of(), BigDecimal.ZERO, null)
                );

                assertThat(result.totalPrice()).isEqualByComparingTo("260.00");
                assertThat(bookingService.findById(result.id()).getFinancialData().unitPrice())
                        .isEqualByComparingTo("230.00");
            }

            @Test
            @DisplayName("should fail before creating dependent data when attendant does not exist")
            void shouldFailWhenAttendantDoesNotExist() {
                Tour tour = saveTour("Passeio Corumbau");

                assertThatThrownBy(() -> bookingService.createBooking(
                        NON_EXISTENT_ID,
                        createRequest(tour.getId(), Set.of(), BigDecimal.ZERO, null)
                ))
                        .isInstanceOf(ResourceNotFoundException.class)
                        .hasMessage("User not found with ID: " + NON_EXISTENT_ID);

                assertThat(bookingRepository.count()).isZero();
                assertThat(clientRepository.count()).isZero();
                assertThat(pickupRepository.count()).isZero();
            }

            @Test
            @DisplayName("should fail before creating dependent data when tour does not exist")
            void shouldFailWhenTourDoesNotExist() {
                User attendant = saveUser();

                assertThatThrownBy(() -> bookingService.createBooking(
                        attendant.getId(),
                        createRequest(NON_EXISTENT_ID, Set.of(), BigDecimal.ZERO, null)
                ))
                        .isInstanceOf(ResourceNotFoundException.class)
                        .hasMessage("Tour not found with ID: " + NON_EXISTENT_ID);

                assertThat(bookingRepository.count()).isZero();
                assertThat(clientRepository.count()).isZero();
                assertThat(pickupRepository.count()).isZero();
            }
        }

        @Nested
        @DisplayName("confirmBooking")
        class ConfirmBookingTests {

            @Test
            @DisplayName("should change a draft to confirmed and register the transition")
            void shouldConfirmDraftAndRegisterHistory() {
                Booking booking = saveBooking(BookingStatus.DRAFT, SCHEDULE, "Passeio Corumbau");

                BookingSummaryDTO result =
                        bookingService.confirmBooking(booking.getId(), booking.getAttendant().getId());
                bookingRepository.flush();

                assertThat(result.status()).isEqualTo(BookingStatus.CONFIRMED);
                assertThat(bookingRepository.findById(booking.getId()))
                        .get()
                        .extracting(Booking::getCurrentStatus)
                        .isEqualTo(BookingStatus.CONFIRMED);
                assertThat(statusHistoryRepository.findAll())
                        .singleElement()
                        .satisfies(history -> {
                            assertThat(history.getPreviousStatus()).isEqualTo(BookingStatus.DRAFT);
                            assertThat(history.getNewStatus()).isEqualTo(BookingStatus.CONFIRMED);
                            assertThat(history.getChangeReason()).isEqualTo("Booking confirmed");
                            assertThat(history.getUser().getId()).isEqualTo(booking.getAttendant().getId());
                        });
            }

            @Test
            @DisplayName("should throw ResourceNotFoundException when confirming a missing booking")
            void shouldThrowWhenConfirmingMissingBooking() {
                assertThatThrownBy(() -> bookingService.confirmBooking(NON_EXISTENT_ID, NON_EXISTENT_ID))
                        .isInstanceOf(ResourceNotFoundException.class)
                        .hasMessage("Booking not found with ID: " + NON_EXISTENT_ID);

                assertThat(statusHistoryRepository.count()).isZero();
            }

            @Test
            @DisplayName("should reject confirmation when the responsible attendant does not exist")
            void shouldRejectConfirmationWithMissingAttendant() {
                Booking booking = saveBooking(BookingStatus.DRAFT, SCHEDULE, "Passeio Corumbau");

                assertThatThrownBy(() -> bookingService.confirmBooking(booking.getId(), NON_EXISTENT_ID))
                        .isInstanceOf(ResourceNotFoundException.class)
                        .hasMessage("User not found with ID: " + NON_EXISTENT_ID);

                assertThat(statusHistoryRepository.count()).isZero();
            }
        }

        @Nested
        @DisplayName("updateBooking")
        class UpdateBookingTests {

            @Test
            @DisplayName("should update client and schedule without recalculating financials")
            void shouldUpdateClientAndScheduleWithoutRecalculation() {
                Booking booking = saveBooking(BookingStatus.DRAFT, SCHEDULE, "Passeio Corumbau");
                LocalDateTime newSchedule = SCHEDULE.plusDays(2);

                BookingSummaryDTO result = bookingService.updateBooking(
                        booking.getId(),
                        updateRequest("Nome atualizado", "+55 73 96666-3003", null, newSchedule, null, null)
                );

                assertThat(result.clientName()).isEqualTo("Nome atualizado");
                assertThat(result.date()).isEqualTo(newSchedule);
                assertThat(booking.getClient().getPhone()).isEqualTo("+55 73 96666-3003");
                assertThat(booking.getFinancialData().totalPrice()).isEqualByComparingTo("500.00");
                assertThat(booking.getFinancialData().manualDiscount()).isEqualByComparingTo("0.00");
            }

            @Test
            @DisplayName("should not recalculate when the requested tour is already assigned")
            void shouldNotRecalculateWhenTourIsUnchanged() {
                Booking booking = saveBooking(BookingStatus.DRAFT, SCHEDULE, "Passeio Corumbau");
                booking.setFinancialData(new FinancialSnapshot(
                        new BigDecimal("200.00"),
                        new BigDecimal("777.00"),
                        new BigDecimal("70.00"),
                        new BigDecimal("17.00")
                ));

                bookingService.updateBooking(
                        booking.getId(),
                        updateRequest(null, null, booking.getTour().getId(), null, null, null)
                );

                assertThat(booking.getFinancialData().totalPrice()).isEqualByComparingTo("777.00");
                assertThat(booking.getFinancialData().manualDiscount()).isEqualByComparingTo("17.00");
            }

            @Test
            @DisplayName("should accept the phone already assigned to the same client")
            void shouldAcceptSameClientPhone() {
                Booking booking = saveBooking(BookingStatus.DRAFT, SCHEDULE, "Passeio Corumbau");
                String currentPhone = booking.getClient().getPhone();

                BookingSummaryDTO result = bookingService.updateBooking(
                        booking.getId(),
                        updateRequest(null, currentPhone, null, null, null, null)
                );

                assertThat(result.clientName()).isEqualTo(booking.getClient().getName());
                assertThat(booking.getClient().getPhone()).isEqualTo(currentPhone);
            }

            @Test
            @DisplayName("should recalculate snapshot and payment when tour changes")
            void shouldRecalculateWhenTourChanges() {
                Booking booking = saveBooking(BookingStatus.CONFIRMED, SCHEDULE, "Passeio antigo");
                booking.setFinancialData(new FinancialSnapshot(
                        new BigDecimal("250.00"),
                        new BigDecimal("250.00"),
                        new BigDecimal("25.00"),
                        new BigDecimal("20.00")
                ));
                attachPayment(booking, new BigDecimal("52.00"));
                Tour newTour = saveTour("Passeio novo", new BigDecimal("300.00"), false);

                BookingSummaryDTO result = bookingService.updateBooking(
                        booking.getId(),
                        updateRequest(null, null, newTour.getId(), null, null, null)
                );
                bookingRepository.flush();

                assertThat(result.tourName()).isEqualTo("Passeio novo");
                assertThat(result.totalPrice()).isEqualByComparingTo("310.00");
                assertThat(booking.getFinancialData().unitPrice()).isEqualByComparingTo("300.00");
                assertThat(booking.getFinancialData().totalPrice()).isEqualByComparingTo("300.00");
                assertThat(booking.getFinancialData().manualDiscount()).isEqualByComparingTo("20.00");
                assertThat(booking.getPayment().getExpectedAmount()).isEqualByComparingTo("62.00");
            }

            @Test
            @DisplayName("should replace members and recalculate participant-dependent amounts")
            void shouldReplaceMembersAndRecalculate() {
                Booking booking = saveBooking(BookingStatus.DRAFT, SCHEDULE, "Passeio Corumbau");
                addMember(booking, "Membro antigo");
                booking.setFinancialData(new FinancialSnapshot(
                        new BigDecimal("250.00"),
                        new BigDecimal("500.00"),
                        new BigDecimal("50.00"),
                        new BigDecimal("20.00")
                ));
                attachPayment(booking, new BigDecimal("102.00"));

                BookingSummaryDTO result = bookingService.updateBooking(
                        booking.getId(),
                        updateRequest(
                                null,
                                null,
                                null,
                                null,
                                Set.of(new GroupMemberDTO("Membro novo", true)),
                                null
                        )
                );
                bookingRepository.flush();

                assertThat(result.groupSize()).isEqualTo(2);
                assertThat(booking.getGroupMembers()).extracting(GroupMember::getName).containsExactly("Membro novo");
                assertThat(booking.getFinancialData().totalPrice()).isEqualByComparingTo("500.00");
                assertThat(booking.getFinancialData().manualDiscount()).isEqualByComparingTo("20.00");
                assertThat(booking.getPayment().getExpectedAmount()).isEqualByComparingTo("102.00");
            }

            @Test
            @DisplayName("should remove all members when an empty set is supplied")
            void shouldRemoveAllMembersWhenEmptySetIsSupplied() {
                Booking booking = saveBooking(BookingStatus.DRAFT, SCHEDULE, "Passeio Corumbau");
                addMember(booking, "Membro antigo");
                booking.setFinancialData(new FinancialSnapshot(
                        new BigDecimal("250.00"),
                        new BigDecimal("500.00"),
                        new BigDecimal("50.00"),
                        BigDecimal.ZERO
                ));

                BookingSummaryDTO result = bookingService.updateBooking(
                        booking.getId(),
                        updateRequest(null, null, null, null, Set.of(), null)
                );
                bookingRepository.flush();

                assertThat(result.groupSize()).isEqualTo(1);
                assertThat(booking.getGroupMembers()).isEmpty();
                assertThat(booking.getFinancialData().totalPrice()).isEqualByComparingTo("250.00");
            }

            @Test
            @DisplayName("should apply a new manual discount and update the payment")
            void shouldApplyDiscountAndUpdatePayment() {
                Booking booking = saveBooking(BookingStatus.CONFIRMED, SCHEDULE, "Passeio Corumbau");
                attachPayment(booking, new BigDecimal("106.00"));

                BookingSummaryDTO result = bookingService.updateBooking(
                        booking.getId(),
                        updateRequest(null, null, null, null, null, new BigDecimal("100.00"))
                );
                bookingRepository.flush();

                assertThat(result.totalPrice()).isEqualByComparingTo("180.00");
                assertThat(booking.getFinancialData().manualDiscount()).isEqualByComparingTo("100.00");
                assertThat(booking.getPayment().getExpectedAmount()).isEqualByComparingTo("36.00");
            }

            @Test
            @DisplayName("should recalculate safely when booking has no payment")
            void shouldRecalculateWithoutCreatingPayment() {
                Booking booking = saveBooking(BookingStatus.DRAFT, SCHEDULE, "Passeio Corumbau");

                bookingService.updateBooking(
                        booking.getId(),
                        updateRequest(null, null, null, null, null, new BigDecimal("25.00"))
                );

                assertThat(booking.getFinancialData().manualDiscount()).isEqualByComparingTo("25.00");
                assertThat(booking.getPayment()).isNull();
                assertThat(paymentRepository.count()).isZero();
            }

            @Test
            @DisplayName("should reject a phone already assigned to another client")
            void shouldRejectDuplicatedClientPhone() {
                Booking booking = saveBooking(BookingStatus.DRAFT, SCHEDULE, "Passeio Corumbau");
                String originalPhone = booking.getClient().getPhone();
                saveClient("Outro cliente", "+55 73 95555-4004", "outro@example.com");

                assertThatThrownBy(() -> bookingService.updateBooking(
                        booking.getId(),
                        updateRequest(null, "+55 73 95555-4004", null, null, null, null)
                ))
                        .isInstanceOf(BadRequestException.class)
                        .hasMessage("Phone number already exists");

                assertThat(booking.getClient().getPhone()).isEqualTo(originalPhone);
            }

            @ParameterizedTest(name = "should reject update when status is {0}")
            @EnumSource(
                    value = BookingStatus.class,
                    names = {"COMPLETED", "CANCELLED", "CANCEL_REQUEST"}
            )
            void shouldRejectUpdateForBlockedStatus(BookingStatus status) {
                Booking booking = saveBooking(status, SCHEDULE, "Passeio " + status);

                assertThatThrownBy(() -> bookingService.updateBooking(
                        booking.getId(),
                        updateRequest("Novo nome", null, null, null, null, null)
                ))
                        .isInstanceOf(BadRequestException.class)
                        .hasMessage("This Booking cannot be changed/accessed because its status is: " + status.name());

                assertThat(booking.getClient().getName()).isEqualTo("João dos Santos");
            }

            @Test
            @DisplayName("should allow update when booking is confirmed")
            void shouldAllowUpdateWhenConfirmed() {
                Booking booking = saveBooking(BookingStatus.CONFIRMED, SCHEDULE, "Passeio Corumbau");

                BookingSummaryDTO result = bookingService.updateBooking(
                        booking.getId(),
                        updateRequest("Nome atualizado", null, null, null, null, null)
                );

                assertThat(result.clientName()).isEqualTo("Nome atualizado");
                assertThat(result.status()).isEqualTo(BookingStatus.CONFIRMED);
            }

            @Test
            @DisplayName("should throw ResourceNotFoundException when updating a missing booking")
            void shouldThrowWhenUpdatingMissingBooking() {
                assertThatThrownBy(() -> bookingService.updateBooking(
                        NON_EXISTENT_ID,
                        updateRequest("Novo nome", null, null, null, null, null)
                ))
                        .isInstanceOf(ResourceNotFoundException.class)
                        .hasMessage("Booking not found with ID: " + NON_EXISTENT_ID);
            }

            @Test
            @DisplayName("should throw ResourceNotFoundException when the new tour does not exist")
            void shouldThrowWhenNewTourDoesNotExist() {
                Booking booking = saveBooking(BookingStatus.DRAFT, SCHEDULE, "Passeio Corumbau");

                assertThatThrownBy(() -> bookingService.updateBooking(
                        booking.getId(),
                        updateRequest(null, null, NON_EXISTENT_ID, null, null, null)
                ))
                        .isInstanceOf(ResourceNotFoundException.class)
                        .hasMessage("Tour not found with ID: " + NON_EXISTENT_ID);

                assertThat(booking.getTour().getName()).isEqualTo("Passeio Corumbau");
            }
        }
    }

    private Booking saveBooking(BookingStatus status, LocalDateTime schedule, String tourName) {
        int clientNumber = CLIENT_SEQUENCE.incrementAndGet();
        return saveBooking(
                status,
                schedule,
                tourName,
                "João dos Santos",
                String.format("+55 73 9%08d", clientNumber),
                "joao.santos." + clientNumber + "@example.com"
        );
    }

    private Booking saveBooking(
            BookingStatus status,
            LocalDateTime schedule,
            String tourName,
            String clientName,
            String clientPhone,
            String clientEmail
    ) {
        User attendant = saveUser(clientEmail + ".attendant." + UUID.randomUUID());
        Tour tour = saveTour(tourName);
        Client client = saveClient(clientName, clientPhone, clientEmail);
        PickupLocation pickup = pickupRepository.save(aPickupLocation().build());

        Booking booking = aBooking().build();
        booking.setId(null);
        booking.setCurrentStatus(status);
        booking.setCustomSchedule(schedule);
        booking.setTour(tour);
        booking.setClient(client);
        booking.setAttendant(attendant);
        booking.setPickupLocation(pickup);
        booking.setCreatedAt(null);
        booking.setUpdatedAt(null);

        return bookingRepository.saveAndFlush(booking);
    }

    private User saveUser() {
        return saveUser("maria.silva@example.com");
    }

    private User saveUser(String email) {
        Permission permission = permissionRepository.save(aPermission().build());
        User user = aUser()
                .withEmail(email)
                .withPermission(permission)
                .build();
        user.setId(null);
        user.setExternalUserId(UUID.randomUUID());
        user.setUserName("attendant-" + UUID.randomUUID());
        user.setCreatedAt(null);
        return userRepository.save(user);
    }

    private Tour saveTour(String name) {
        return saveTour(name, new BigDecimal("250.00"), false);
    }

    private Tour saveTour(String name, BigDecimal basePrice, boolean promotional) {
        CategoryTour category = categoryRepository.save(aCategoryTour().build());
        category.setName("Categoria " + UUID.randomUUID());

        Tour tour = aTour()
                .withName(name)
                .withCategory(category)
                .promotional(promotional)
                .build();
        tour.setId(null);
        tour.setBasePricePerPerson(basePrice);
        if (promotional) {
            tour.setPromoPricePerPerson(basePrice.subtract(new BigDecimal("20.00")));
        }
        return tourRepository.save(tour);
    }

    private Client saveClient(String name, String phone, String email) {
        Client client = aClient().build();
        client.setId(null);
        client.setName(name);
        client.setPhone(phone);
        client.setEmail(email);
        client.setCreatedAt(null);
        return clientRepository.save(client);
    }

    private void addMember(Booking booking, String name) {
        booking.addGroupMember(new GroupMember(name, false));
    }

    private void attachPayment(Booking booking, BigDecimal expectedAmount) {
        Payment payment = paymentRepository.save(
                new Payment(expectedAmount, "https://example.com/pix/receipt", booking)
        );
        booking.setPayment(payment);
        bookingRepository.flush();
    }

    private CreateBookingRequest createRequest(
            Long tourId,
            Set<GroupMemberDTO> members,
            BigDecimal discount,
            String pixUrl
    ) {
        return new CreateBookingRequest(
                clientDTO("Ana", "+55 73 98888-1001", "ana@example.com"),
                members,
                tourId,
                SCHEDULE,
                pickupDTO(),
                discount,
                pixUrl
        );
    }

    private ClientDTO clientDTO(String name, String phone, String email) {
        return new ClientDTO(name, phone, email);
    }

    private PickupDTO pickupDTO() {
        return new PickupDTO(
                "45810-000",
                "Praça da Igreja de Caraíva",
                "Ao lado da igreja",
                new BigDecimal("30.00")
        );
    }

    private UpdateBookingRequest updateRequest(
            String clientName,
            String clientPhone,
            Long tourId,
            LocalDateTime schedule,
            Set<GroupMemberDTO> members,
            BigDecimal discount
    ) {
        return new UpdateBookingRequest(
                clientName,
                clientPhone,
                tourId,
                schedule,
                members,
                discount
        );
    }

    private void assertInitialHistory(Long bookingId, Long attendantId, BookingStatus status) {
        assertThat(statusHistoryRepository.findAll())
                .filteredOn(history -> history.getBooking().getId().equals(bookingId))
                .singleElement()
                .satisfies(history -> {
                    assertThat(history.getPreviousStatus()).isNull();
                    assertThat(history.getNewStatus()).isEqualTo(status);
                    assertThat(history.getChangeReason()).isEqualTo("Created booking");
                    assertThat(history.getUser().getId()).isEqualTo(attendantId);
                });
    }
}

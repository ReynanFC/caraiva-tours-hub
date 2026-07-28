package com.caraivatours.hub.refundrequest;

import com.caraivatours.hub.AbstractIntegrationTest;
import com.caraivatours.hub.auth.PermissionRepository;
import com.caraivatours.hub.auth.entity.Permission;
import com.caraivatours.hub.auth.entity.enums.UserRole;
import com.caraivatours.hub.booking.Booking;
import com.caraivatours.hub.booking.BookingRepository;
import com.caraivatours.hub.booking.enums.BookingStatus;
import com.caraivatours.hub.booking.statushistory.StatusHistoryRepository;
import com.caraivatours.hub.category.CategoryTour;
import com.caraivatours.hub.category.CategoryTourRepository;
import com.caraivatours.hub.client.Client;
import com.caraivatours.hub.client.ClientRepository;
import com.caraivatours.hub.pickuplocation.PickupLocation;
import com.caraivatours.hub.pickuplocation.PickupLocationRepository;
import com.caraivatours.hub.refundrequest.dto.request.CreateRefundRequestDTO;
import com.caraivatours.hub.refundrequest.dto.request.ResolveRefundRequestDTO;
import com.caraivatours.hub.refundrequest.dto.response.RefundRequestResponseDTO;
import com.caraivatours.hub.refundrequest.enums.RefundStatus;
import com.caraivatours.hub.shared.dto.PagedResult;
import com.caraivatours.hub.shared.exceptions.BadRequestException;
import com.caraivatours.hub.shared.exceptions.ResourceNotFoundException;
import com.caraivatours.hub.tour.TourRepository;
import com.caraivatours.hub.tour.entity.Tour;
import com.caraivatours.hub.user.User;
import com.caraivatours.hub.user.UserRepository;
import jakarta.persistence.EntityManager;
import jakarta.persistence.PersistenceContext;
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
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.UUID;
import java.util.concurrent.atomic.AtomicInteger;

import static com.caraivatours.hub.support.fixtures.BookingTestDataBuilder.aBooking;
import static com.caraivatours.hub.support.fixtures.CategoryTourTestDataBuilder.aCategoryTour;
import static com.caraivatours.hub.support.fixtures.ClientTestDataBuilder.aClient;
import static com.caraivatours.hub.support.fixtures.PermissionTestDataBuilder.aPermission;
import static com.caraivatours.hub.support.fixtures.PickupLocationTestDataBuilder.aPickupLocation;
import static com.caraivatours.hub.support.fixtures.RefundRequestTestDataBuilder.aRefundRequest;
import static com.caraivatours.hub.support.fixtures.TourTestDataBuilder.aTour;
import static com.caraivatours.hub.support.fixtures.UserTestDataBuilder.aUser;
import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;

@SpringBootTest
@ActiveProfiles("test")
@Transactional
@DisplayName("Refund request integration tests")
class RefundRequestTest extends AbstractIntegrationTest {

    private static final long NON_EXISTENT_ID = Long.MAX_VALUE;
    private static final AtomicInteger DATA_SEQUENCE = new AtomicInteger();

    @Autowired
    private RefundRequestRepository refundRequestRepository;

    @Autowired
    private RefundRequestService refundRequestService;

    @Autowired
    private BookingRepository bookingRepository;

    @Autowired
    private StatusHistoryRepository statusHistoryRepository;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private PermissionRepository permissionRepository;

    @Autowired
    private TourRepository tourRepository;

    @Autowired
    private CategoryTourRepository categoryRepository;

    @Autowired
    private ClientRepository clientRepository;

    @Autowired
    private PickupLocationRepository pickupLocationRepository;

    @PersistenceContext
    private EntityManager entityManager;

    @Nested
    @DisplayName("RefundRequestRepository")
    class RefundRequestRepositoryTests {

        @Nested
        @DisplayName("Persistence")
        class PersistenceTests {

            @Test
            @DisplayName("should persist a pending request with booking and requester")
            void shouldPersistPendingRequestWithRelationships() {
                User requester = saveUser(UserRole.EMPLOYEE);
                Booking booking = saveBooking(BookingStatus.CONFIRMED, requester);

                RefundRequest saved = saveRefundRequest(
                        booking,
                        requester,
                        RefundStatus.PENDING,
                        "Cliente não poderá comparecer",
                        null,
                        null
                );
                entityManager.clear();

                assertThat(refundRequestRepository.findById(saved.getId()))
                        .isPresent()
                        .get()
                        .satisfies(refund -> {
                            assertThat(refund.getReason()).isEqualTo("Cliente não poderá comparecer");
                            assertThat(refund.getRefundStatus()).isEqualTo(RefundStatus.PENDING);
                            assertThat(refund.getRequestedAt()).isNotNull();
                            assertThat(refund.getResolvedAt()).isNull();
                            assertThat(refund.getAdminObservation()).isNull();
                            assertThat(refund.getResolvedByUser()).isNull();
                            assertThat(refund.getBooking().getId()).isEqualTo(booking.getId());
                            assertThat(refund.getRequestedByUser().getId()).isEqualTo(requester.getId());
                        });
            }

            @Test
            @DisplayName("should persist resolution metadata")
            void shouldPersistResolutionMetadata() {
                User requester = saveUser(UserRole.EMPLOYEE);
                User admin = saveUser(UserRole.ADMIN);
                Booking booking = saveBooking(BookingStatus.CANCEL_REQUEST, requester);

                RefundRequest saved = saveRefundRequest(
                        booking,
                        requester,
                        RefundStatus.APPROVED,
                        "Solicitação de reembolso",
                        "Reembolso autorizado",
                        admin
                );
                entityManager.clear();

                assertThat(refundRequestRepository.findById(saved.getId()))
                        .isPresent()
                        .get()
                        .satisfies(refund -> {
                            assertThat(refund.getRefundStatus()).isEqualTo(RefundStatus.APPROVED);
                            assertThat(refund.getAdminObservation()).isEqualTo("Reembolso autorizado");
                            assertThat(refund.getResolvedAt()).isNotNull();
                            assertThat(refund.getResolvedByUser().getId()).isEqualTo(admin.getId());
                        });
            }
        }

        @Nested
        @DisplayName("existsByBookingIdAndRefundStatus")
        class ExistsByBookingIdAndRefundStatusTests {

            @Test
            @DisplayName("should distinguish status and booking")
            void shouldDistinguishStatusAndBooking() {
                User requester = saveUser(UserRole.EMPLOYEE);
                Booking booking = saveBooking(BookingStatus.DRAFT, requester);
                Booking otherBooking = saveBooking(BookingStatus.DRAFT, requester);
                saveRefundRequest(
                        booking,
                        requester,
                        RefundStatus.PENDING,
                        "Pedido pendente",
                        null,
                        null
                );

                assertThat(refundRequestRepository.existsByBookingIdAndRefundStatus(
                        booking.getId(),
                        RefundStatus.PENDING
                )).isTrue();
                assertThat(refundRequestRepository.existsByBookingIdAndRefundStatus(
                        booking.getId(),
                        RefundStatus.APPROVED
                )).isFalse();
                assertThat(refundRequestRepository.existsByBookingIdAndRefundStatus(
                        otherBooking.getId(),
                        RefundStatus.PENDING
                )).isFalse();
            }
        }

        @Nested
        @DisplayName("findAllByRequestedByUserId")
        class FindAllByRequestedByUserIdTests {

            @Test
            @DisplayName("should return only requester records with pagination and sorting")
            void shouldFilterPaginateAndSortByRequester() {
                User requester = saveUser(UserRole.EMPLOYEE);
                User otherRequester = saveUser(UserRole.EMPLOYEE);
                Booking firstBooking = saveBooking(BookingStatus.DRAFT, requester);
                Booking secondBooking = saveBooking(BookingStatus.DRAFT, requester);
                Booking otherBooking = saveBooking(BookingStatus.DRAFT, otherRequester);

                RefundRequest first = saveRefundRequest(
                        firstBooking, requester, RefundStatus.PENDING, "Primeiro", null, null
                );
                RefundRequest second = saveRefundRequest(
                        secondBooking, requester, RefundStatus.REJECTED, "Segundo", "Negado", null
                );
                saveRefundRequest(
                        otherBooking, otherRequester, RefundStatus.PENDING, "Outro usuário", null, null
                );

                Page<RefundRequest> result = refundRequestRepository.findAllByRequestedByUserId(
                        requester.getId(),
                        PageRequest.of(0, 1, Sort.by("id").descending())
                );

                assertThat(result.getContent())
                        .singleElement()
                        .extracting(RefundRequest::getId)
                        .isEqualTo(second.getId());
                assertThat(result.getContent().getFirst().getId()).isNotEqualTo(first.getId());
                assertThat(result.getTotalElements()).isEqualTo(2);
                assertThat(result.getTotalPages()).isEqualTo(2);
            }

            @Test
            @DisplayName("should return empty page when requester has no records")
            void shouldReturnEmptyWhenRequesterHasNoRecords() {
                assertThat(refundRequestRepository.findAllByRequestedByUserId(
                        NON_EXISTENT_ID,
                        PageRequest.of(0, 10)
                )).isEmpty();
            }
        }
    }

    @Nested
    @DisplayName("RefundRequestService")
    class RefundRequestServiceTests {

        @Nested
        @DisplayName("findAll")
        class FindAllTests {

            @Test
            @DisplayName("should map all requests preserving pagination")
            void shouldMapAllRequestsPreservingPagination() {
                User requester = saveUser(UserRole.EMPLOYEE);
                Booking firstBooking = saveBooking(BookingStatus.DRAFT, requester);
                Booking secondBooking = saveBooking(BookingStatus.DRAFT, requester);
                RefundRequest first = saveRefundRequest(
                        firstBooking, requester, RefundStatus.PENDING, "Primeiro motivo", null, null
                );
                RefundRequest second = saveRefundRequest(
                        secondBooking, requester, RefundStatus.REJECTED, "Segundo motivo", "Não aprovado", null
                );

                PagedResult<RefundRequestResponseDTO> result = refundRequestService.findAll(
                        PageRequest.of(0, 1, Sort.by("id").descending())
                );

                assertThat(result.content())
                        .singleElement()
                        .satisfies(refund -> {
                            assertThat(refund.id()).isEqualTo(second.getId());
                            assertThat(refund.reason()).isEqualTo("Segundo motivo");
                            assertThat(refund.refundStatus()).isEqualTo(RefundStatus.REJECTED);
                            assertThat(refund.bookingId()).isEqualTo(secondBooking.getId());
                            assertThat(refund.requestedByUserId()).isEqualTo(requester.getId());
                        });
                assertThat(result.content().getFirst().id()).isNotEqualTo(first.getId());
                assertThat(result.page()).isZero();
                assertThat(result.size()).isEqualTo(1);
                assertThat(result.totalElements()).isEqualTo(2);
                assertThat(result.totalPages()).isEqualTo(2);
            }

            @Test
            @DisplayName("should return empty paged result when there are no requests")
            void shouldReturnEmptyPagedResult() {
                PagedResult<RefundRequestResponseDTO> result = refundRequestService.findAll(
                        PageRequest.of(0, 10)
                );

                assertThat(result.content()).isEmpty();
                assertThat(result.totalElements()).isZero();
                assertThat(result.totalPages()).isZero();
            }
        }

        @Nested
        @DisplayName("findMine")
        class FindMineTests {

            @Test
            @DisplayName("should map only requests made by requester")
            void shouldMapOnlyRequesterRecords() {
                User requester = saveUser(UserRole.EMPLOYEE);
                User otherRequester = saveUser(UserRole.EMPLOYEE);
                Booking requesterBooking = saveBooking(BookingStatus.DRAFT, requester);
                Booking otherBooking = saveBooking(BookingStatus.DRAFT, otherRequester);
                RefundRequest expected = saveRefundRequest(
                        requesterBooking, requester, RefundStatus.PENDING, "Meu pedido", null, null
                );
                saveRefundRequest(
                        otherBooking, otherRequester, RefundStatus.PENDING, "Pedido alheio", null, null
                );

                PagedResult<RefundRequestResponseDTO> result = refundRequestService.findMine(
                        requester.getId(),
                        PageRequest.of(0, 10)
                );

                assertThat(result.content())
                        .singleElement()
                        .satisfies(refund -> {
                            assertThat(refund.id()).isEqualTo(expected.getId());
                            assertThat(refund.requestedByUserId()).isEqualTo(requester.getId());
                        });
                assertThat(result.totalElements()).isEqualTo(1);
            }

            @Test
            @DisplayName("should return empty result when requester has no requests")
            void shouldReturnEmptyWhenRequesterHasNoRequests() {
                PagedResult<RefundRequestResponseDTO> result = refundRequestService.findMine(
                        NON_EXISTENT_ID,
                        PageRequest.of(0, 10)
                );

                assertThat(result.content()).isEmpty();
                assertThat(result.totalElements()).isZero();
            }
        }

        @Nested
        @DisplayName("create")
        class CreateTests {

            @Test
            @DisplayName("should create trimmed pending request and move booking to cancellation review")
            void shouldCreateRequestAndMoveBookingToCancellationReview() {
                User requester = saveUser(UserRole.EMPLOYEE);
                Booking booking = saveBooking(BookingStatus.CONFIRMED, requester);

                RefundRequestResponseDTO result = refundRequestService.create(
                        requester.getId(),
                        new CreateRefundRequestDTO(booking.getId(), "  Cliente desistiu do passeio  ")
                );
                entityManager.flush();

                assertThat(result.id()).isNotNull();
                assertThat(result.reason()).isEqualTo("Cliente desistiu do passeio");
                assertThat(result.refundStatus()).isEqualTo(RefundStatus.PENDING);
                assertThat(result.requestedAt()).isNotNull();
                assertThat(result.resolvedAt()).isNull();
                assertThat(result.bookingId()).isEqualTo(booking.getId());
                assertThat(result.requestedByUserId()).isEqualTo(requester.getId());
                assertThat(result.resolvedByUserId()).isNull();
                assertThat(bookingRepository.findById(booking.getId()))
                        .isPresent()
                        .get()
                        .extracting(Booking::getCurrentStatus)
                        .isEqualTo(BookingStatus.CANCEL_REQUEST);
                assertStatusHistory(
                        booking.getId(),
                        requester.getId(),
                        BookingStatus.CONFIRMED,
                        BookingStatus.CANCEL_REQUEST,
                        "Refund requested"
                );
            }

            @Test
            @DisplayName("should reject request made by administrator")
            void shouldRejectRequestMadeByAdministrator() {
                User admin = saveUser(UserRole.ADMIN);
                Booking booking = saveBooking(BookingStatus.CONFIRMED, admin);

                assertThatThrownBy(() -> refundRequestService.create(
                        admin.getId(),
                        new CreateRefundRequestDTO(booking.getId(), "Motivo")
                ))
                        .isInstanceOf(BadRequestException.class)
                        .hasMessage("Administrators cannot request refunds");
                assertThat(refundRequestRepository.count()).isZero();
                assertThat(booking.getCurrentStatus()).isEqualTo(BookingStatus.CONFIRMED);
            }

            @Test
            @DisplayName("should throw when requester does not exist")
            void shouldThrowWhenRequesterDoesNotExist() {
                assertThatThrownBy(() -> refundRequestService.create(
                        NON_EXISTENT_ID,
                        new CreateRefundRequestDTO(1L, "Motivo")
                ))
                        .isInstanceOf(ResourceNotFoundException.class)
                        .hasMessage("User not found with ID: " + NON_EXISTENT_ID);
            }

            @Test
            @DisplayName("should throw when booking does not exist")
            void shouldThrowWhenBookingDoesNotExist() {
                User requester = saveUser(UserRole.EMPLOYEE);

                assertThatThrownBy(() -> refundRequestService.create(
                        requester.getId(),
                        new CreateRefundRequestDTO(NON_EXISTENT_ID, "Motivo")
                ))
                        .isInstanceOf(ResourceNotFoundException.class)
                        .hasMessage("Booking not found with ID: " + NON_EXISTENT_ID);
            }

            @ParameterizedTest(name = "should reject booking in {0}")
            @EnumSource(
                    value = BookingStatus.class,
                    names = {"CANCELLED", "CANCEL_REQUEST"}
            )
            @DisplayName("should reject booking already cancelled or under cancellation")
            void shouldRejectBookingAlreadyInCancellationFlow(BookingStatus status) {
                User requester = saveUser(UserRole.EMPLOYEE);
                Booking booking = saveBooking(status, requester);

                assertThatThrownBy(() -> refundRequestService.create(
                        requester.getId(),
                        new CreateRefundRequestDTO(booking.getId(), "Motivo")
                ))
                        .isInstanceOf(BadRequestException.class)
                        .hasMessage("This booking already has a cancellation in progress or has been cancelled");
                assertThat(refundRequestRepository.count()).isZero();
                assertThat(booking.getCurrentStatus()).isEqualTo(status);
            }

            @Test
            @DisplayName("should reject a second pending request for the booking")
            void shouldRejectSecondPendingRequest() {
                User requester = saveUser(UserRole.EMPLOYEE);
                Booking booking = saveBooking(BookingStatus.DRAFT, requester);
                saveRefundRequest(
                        booking, requester, RefundStatus.PENDING, "Pedido existente", null, null
                );

                assertThatThrownBy(() -> refundRequestService.create(
                        requester.getId(),
                        new CreateRefundRequestDTO(booking.getId(), "Novo pedido")
                ))
                        .isInstanceOf(BadRequestException.class)
                        .hasMessage("This booking already has a pending refund request");
                assertThat(refundRequestRepository.count()).isEqualTo(1);
                assertThat(booking.getCurrentStatus()).isEqualTo(BookingStatus.DRAFT);
            }

            @Test
            @DisplayName("should allow a new request when previous request was resolved")
            void shouldAllowRequestAfterPreviousResolution() {
                User requester = saveUser(UserRole.EMPLOYEE);
                User admin = saveUser(UserRole.ADMIN);
                Booking booking = saveBooking(BookingStatus.DRAFT, requester);
                saveRefundRequest(
                        booking,
                        requester,
                        RefundStatus.REJECTED,
                        "Pedido anterior",
                        "Rejeitado",
                        admin
                );

                RefundRequestResponseDTO result = refundRequestService.create(
                        requester.getId(),
                        new CreateRefundRequestDTO(booking.getId(), "Novo motivo")
                );

                assertThat(result.refundStatus()).isEqualTo(RefundStatus.PENDING);
                assertThat(refundRequestRepository.count()).isEqualTo(2);
                assertThat(booking.getCurrentStatus()).isEqualTo(BookingStatus.CANCEL_REQUEST);
            }
        }

        @Nested
        @DisplayName("resolve")
        class ResolveTests {

            @Test
            @DisplayName("should approve pending request, cancel booking and register history")
            void shouldApproveRequestAndCancelBooking() {
                User requester = saveUser(UserRole.EMPLOYEE);
                User admin = saveUser(UserRole.ADMIN);
                Booking booking = saveBooking(BookingStatus.CANCEL_REQUEST, requester);
                RefundRequest refund = saveRefundRequest(
                        booking, requester, RefundStatus.PENDING, "Pedido", null, null
                );

                RefundRequestResponseDTO result = refundRequestService.resolve(
                        refund.getId(),
                        admin.getId(),
                        new ResolveRefundRequestDTO(RefundStatus.APPROVED, "Pagamento será estornado")
                );
                entityManager.flush();

                assertThat(result.refundStatus()).isEqualTo(RefundStatus.APPROVED);
                assertThat(result.adminObservation()).isEqualTo("Pagamento será estornado");
                assertThat(result.resolvedAt()).isNotNull();
                assertThat(result.resolvedByUserId()).isEqualTo(admin.getId());
                assertThat(booking.getCurrentStatus()).isEqualTo(BookingStatus.CANCELLED);
                assertStatusHistory(
                        booking.getId(),
                        admin.getId(),
                        BookingStatus.CANCEL_REQUEST,
                        BookingStatus.CANCELLED,
                        "Refund request approved"
                );
            }

            @Test
            @DisplayName("should reject pending request without changing booking status")
            void shouldRejectRequestWithoutChangingBookingStatus() {
                User requester = saveUser(UserRole.EMPLOYEE);
                User admin = saveUser(UserRole.ADMIN);
                Booking booking = saveBooking(BookingStatus.CANCEL_REQUEST, requester);
                RefundRequest refund = saveRefundRequest(
                        booking, requester, RefundStatus.PENDING, "Pedido", null, null
                );

                RefundRequestResponseDTO result = refundRequestService.resolve(
                        refund.getId(),
                        admin.getId(),
                        new ResolveRefundRequestDTO(RefundStatus.REJECTED, null)
                );
                entityManager.flush();

                assertThat(result.refundStatus()).isEqualTo(RefundStatus.REJECTED);
                assertThat(result.adminObservation()).isNull();
                assertThat(result.resolvedAt()).isNotNull();
                assertThat(result.resolvedByUserId()).isEqualTo(admin.getId());
                assertThat(booking.getCurrentStatus()).isEqualTo(BookingStatus.CANCEL_REQUEST);
                assertThat(statusHistoryRepository.findAll())
                        .filteredOn(history -> history.getBooking().getId().equals(booking.getId()))
                        .isEmpty();
            }

            @Test
            @DisplayName("should reject resolution made by non-admin user")
            void shouldRejectResolutionMadeByNonAdmin() {
                User requester = saveUser(UserRole.EMPLOYEE);
                Booking booking = saveBooking(BookingStatus.CANCEL_REQUEST, requester);
                RefundRequest refund = saveRefundRequest(
                        booking, requester, RefundStatus.PENDING, "Pedido", null, null
                );

                assertThatThrownBy(() -> refundRequestService.resolve(
                        refund.getId(),
                        requester.getId(),
                        new ResolveRefundRequestDTO(RefundStatus.APPROVED, "Aprovar")
                ))
                        .isInstanceOf(BadRequestException.class)
                        .hasMessage("Only administrators can resolve refund requests");
                assertThat(refund.getRefundStatus()).isEqualTo(RefundStatus.PENDING);
                assertThat(booking.getCurrentStatus()).isEqualTo(BookingStatus.CANCEL_REQUEST);
            }

            @Test
            @DisplayName("should throw when resolver does not exist")
            void shouldThrowWhenResolverDoesNotExist() {
                assertThatThrownBy(() -> refundRequestService.resolve(
                        1L,
                        NON_EXISTENT_ID,
                        new ResolveRefundRequestDTO(RefundStatus.APPROVED, "Aprovar")
                ))
                        .isInstanceOf(ResourceNotFoundException.class)
                        .hasMessage("User not found with ID: " + NON_EXISTENT_ID);
            }

            @Test
            @DisplayName("should reject pending as resolution outcome")
            void shouldRejectPendingAsResolutionOutcome() {
                User admin = saveUser(UserRole.ADMIN);

                assertThatThrownBy(() -> refundRequestService.resolve(
                        NON_EXISTENT_ID,
                        admin.getId(),
                        new ResolveRefundRequestDTO(RefundStatus.PENDING, "Manter pendente")
                ))
                        .isInstanceOf(BadRequestException.class)
                        .hasMessage("A refund request can only be approved or rejected");
            }

            @Test
            @DisplayName("should throw when refund request does not exist")
            void shouldThrowWhenRefundRequestDoesNotExist() {
                User admin = saveUser(UserRole.ADMIN);

                assertThatThrownBy(() -> refundRequestService.resolve(
                        NON_EXISTENT_ID,
                        admin.getId(),
                        new ResolveRefundRequestDTO(RefundStatus.APPROVED, "Aprovar")
                ))
                        .isInstanceOf(ResourceNotFoundException.class)
                        .hasMessage("Refund request not found with ID: " + NON_EXISTENT_ID);
            }

            @ParameterizedTest(name = "should reject request already {0}")
            @EnumSource(
                    value = RefundStatus.class,
                    names = {"APPROVED", "REJECTED"}
            )
            @DisplayName("should reject a request already resolved")
            void shouldRejectAlreadyResolvedRequest(RefundStatus resolvedStatus) {
                User requester = saveUser(UserRole.EMPLOYEE);
                User admin = saveUser(UserRole.ADMIN);
                Booking booking = saveBooking(BookingStatus.CANCEL_REQUEST, requester);
                RefundRequest refund = saveRefundRequest(
                        booking,
                        requester,
                        resolvedStatus,
                        "Pedido",
                        "Já analisado",
                        admin
                );
                LocalDateTime resolvedAt = refund.getResolvedAt();

                assertThatThrownBy(() -> refundRequestService.resolve(
                        refund.getId(),
                        admin.getId(),
                        new ResolveRefundRequestDTO(RefundStatus.APPROVED, "Analisar novamente")
                ))
                        .isInstanceOf(BadRequestException.class)
                        .hasMessage("This refund request has already been resolved");
                assertThat(refund.getRefundStatus()).isEqualTo(resolvedStatus);
                assertThat(refund.getResolvedAt()).isEqualTo(resolvedAt);
            }
        }
    }

    private RefundRequest saveRefundRequest(
            Booking booking,
            User requester,
            RefundStatus status,
            String reason,
            String adminObservation,
            User resolver
    ) {
        RefundRequest refundRequest = aRefundRequest().build();
        refundRequest.setId(null);
        refundRequest.setReason(reason);
        refundRequest.setRefundStatus(status);
        refundRequest.setBooking(booking);
        refundRequest.setRequestedByUser(requester);
        refundRequest.setRequestedAt(null);
        refundRequest.setAdminObservation(adminObservation);
        refundRequest.setResolvedByUser(resolver);
        refundRequest.setResolvedAt(status == RefundStatus.PENDING
                ? null
                : LocalDateTime.now().minusMinutes(5));
        return refundRequestRepository.saveAndFlush(refundRequest);
    }

    private User saveUser(UserRole role) {
        int sequence = DATA_SEQUENCE.incrementAndGet();
        Permission permission = permissionRepository.saveAndFlush(aPermission()
                .withRole(role)
                .build());
        User user = aUser()
                .withEmail("user." + sequence + "@example.com")
                .withPermission(permission)
                .build();
        user.setId(null);
        user.setExternalUserId(UUID.randomUUID());
        user.setUserName("user-" + sequence);
        user.setCreatedAt(null);
        return userRepository.saveAndFlush(user);
    }

    private Booking saveBooking(BookingStatus status, User attendant) {
        int sequence = DATA_SEQUENCE.incrementAndGet();
        CategoryTour category = aCategoryTour().build();
        category.setId(null);
        category.setName("Categoria " + sequence);
        category = categoryRepository.saveAndFlush(category);

        Tour tour = aTour()
                .withName("Passeio " + sequence)
                .withCategory(category)
                .build();
        tour.setId(null);
        tour = tourRepository.saveAndFlush(tour);

        Client client = aClient()
                .withName("Cliente " + sequence)
                .withPhone(String.format("+55 73 9%08d", sequence))
                .withEmail("client." + sequence + "@example.com")
                .build();
        client.setId(null);
        client.setCreatedAt(null);
        client = clientRepository.saveAndFlush(client);

        PickupLocation pickup = aPickupLocation().build();
        pickup.setId(null);
        pickup = pickupLocationRepository.saveAndFlush(pickup);

        Booking booking = aBooking().build();
        booking.setId(null);
        booking.setCurrentStatus(status);
        booking.setTour(tour);
        booking.setClient(client);
        booking.setAttendant(attendant);
        booking.setPickupLocation(pickup);
        booking.setCreatedAt(null);
        booking.setUpdatedAt(null);
        return bookingRepository.saveAndFlush(booking);
    }

    private void assertStatusHistory(
            Long bookingId,
            Long userId,
            BookingStatus previousStatus,
            BookingStatus newStatus,
            String reason
    ) {
        assertThat(statusHistoryRepository.findAll())
                .filteredOn(history -> history.getBooking().getId().equals(bookingId))
                .singleElement()
                .satisfies(history -> {
                    assertThat(history.getPreviousStatus()).isEqualTo(previousStatus);
                    assertThat(history.getNewStatus()).isEqualTo(newStatus);
                    assertThat(history.getUser().getId()).isEqualTo(userId);
                    assertThat(history.getChangeReason()).isEqualTo(reason);
                    assertThat(history.getChangedAt()).isNotNull();
                });
    }
}

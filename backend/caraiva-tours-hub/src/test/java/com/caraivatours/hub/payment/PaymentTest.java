package com.caraivatours.hub.payment;

import com.caraivatours.hub.AbstractIntegrationTest;
import com.caraivatours.hub.auth.PermissionRepository;
import com.caraivatours.hub.auth.entity.Permission;
import com.caraivatours.hub.booking.Booking;
import com.caraivatours.hub.booking.BookingRepository;
import com.caraivatours.hub.booking.embeddable.FinancialSnapshot;
import com.caraivatours.hub.booking.enums.BookingStatus;
import com.caraivatours.hub.category.CategoryTour;
import com.caraivatours.hub.category.CategoryTourRepository;
import com.caraivatours.hub.client.Client;
import com.caraivatours.hub.client.ClientRepository;
import com.caraivatours.hub.payment.dto.PaymentDetailDTO;
import com.caraivatours.hub.payment.dto.PaymentOverviewDTO;
import com.caraivatours.hub.payment.dto.PaymentSummaryDTO;
import com.caraivatours.hub.payment.dto.ReservationPaymentDTO;
import com.caraivatours.hub.payment.projection.PaymentOverviewProjection;
import com.caraivatours.hub.pickuplocation.PickupLocation;
import com.caraivatours.hub.pickuplocation.PickupLocationRepository;
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
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Sort;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;
import java.util.concurrent.atomic.AtomicInteger;

import static com.caraivatours.hub.support.fixtures.BookingTestDataBuilder.aBooking;
import static com.caraivatours.hub.support.fixtures.CategoryTourTestDataBuilder.aCategoryTour;
import static com.caraivatours.hub.support.fixtures.ClientTestDataBuilder.aClient;
import static com.caraivatours.hub.support.fixtures.PaymentTestDataBuilder.aPayment;
import static com.caraivatours.hub.support.fixtures.PermissionTestDataBuilder.aPermission;
import static com.caraivatours.hub.support.fixtures.PickupLocationTestDataBuilder.aPickupLocation;
import static com.caraivatours.hub.support.fixtures.TourTestDataBuilder.aTour;
import static com.caraivatours.hub.support.fixtures.UserTestDataBuilder.aUser;
import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;

@SpringBootTest
@ActiveProfiles("test")
@Transactional
@DisplayName("Payment integration tests")
class PaymentTest extends AbstractIntegrationTest {

    private static final long NON_EXISTENT_ID = 999_999L;
    private static final AtomicInteger DATA_SEQUENCE = new AtomicInteger();

    @Autowired
    private PaymentRepository paymentRepository;

    @Autowired
    private PaymentService paymentService;

    @Autowired
    private BookingRepository bookingRepository;

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

    @PersistenceContext
    private EntityManager entityManager;

    @Nested
    @DisplayName("PaymentRepository")
    class PaymentRepositoryTests {

        @Nested
        @DisplayName("Persistence")
        class PersistenceTests {

            @Test
            @DisplayName("should persist payment and its booking relationship")
            void shouldPersistPaymentAndBookingRelationship() {
                Booking booking = saveBooking(BookingStatus.CONFIRMED, "João dos Santos");
                Payment saved = attachPayment(
                        booking,
                        new BigDecimal("106.00"),
                        "https://example.com/receipts/payment-001.pdf"
                );
                entityManager.clear();

                assertThat(paymentRepository.findById(saved.getId()))
                        .isPresent()
                        .get()
                        .satisfies(payment -> {
                            assertThat(payment.getExpectedAmount()).isEqualByComparingTo("106.00");
                            assertThat(payment.getReceiptUrl())
                                    .isEqualTo("https://example.com/receipts/payment-001.pdf");
                            assertThat(payment.getPaidAt()).isNotNull();
                            assertThat(payment.getBooking().getId()).isEqualTo(booking.getId());
                        });
            }
        }

        @Nested
        @DisplayName("findAllByFilters")
        class FindAllByFiltersTests {

            @Test
            @DisplayName("should return every payment when filters are null")
            void shouldReturnAllPaymentsWithoutFilters() {
                Payment first = attachPayment(
                        saveBooking(BookingStatus.CONFIRMED, "Ana"),
                        new BigDecimal("100.00"),
                        "receipt-ana"
                );
                Payment second = attachPayment(
                        saveBooking(BookingStatus.COMPLETED, "Bruno"),
                        new BigDecimal("120.00"),
                        "receipt-bruno"
                );

                Page<Payment> result =
                        paymentRepository.findAllByFilters(null, null, PageRequest.of(0, 10));

                assertThat(result.getContent())
                        .extracting(Payment::getId)
                        .containsExactlyInAnyOrder(first.getId(), second.getId());
            }

            @Test
            @DisplayName("should filter by payment id")
            void shouldFilterByPaymentId() {
                Payment expected = attachPayment(
                        saveBooking(BookingStatus.CONFIRMED, "Ana"),
                        new BigDecimal("100.00"),
                        "receipt-ana"
                );
                attachPayment(
                        saveBooking(BookingStatus.CONFIRMED, "Bruno"),
                        new BigDecimal("120.00"),
                        "receipt-bruno"
                );

                assertThat(paymentRepository.findAllByFilters(
                        expected.getId(),
                        null,
                        PageRequest.of(0, 10)
                ).getContent()).containsExactly(expected);
            }

            @Test
            @DisplayName("should filter by client name fragment ignoring case")
            void shouldFilterByClientNameIgnoringCase() {
                Payment expected = attachPayment(
                        saveBooking(BookingStatus.CONFIRMED, "Maria da Silva"),
                        new BigDecimal("100.00"),
                        "receipt-maria"
                );
                attachPayment(
                        saveBooking(BookingStatus.CONFIRMED, "João dos Santos"),
                        new BigDecimal("120.00"),
                        "receipt-joao"
                );

                assertThat(paymentRepository.findAllByFilters(
                        null,
                        "SILVA",
                        PageRequest.of(0, 10)
                ).getContent()).containsExactly(expected);
            }

            @Test
            @DisplayName("should require both filters when id and client name are supplied")
            void shouldCombineIdAndClientNameFilters() {
                Payment payment = attachPayment(
                        saveBooking(BookingStatus.CONFIRMED, "Maria da Silva"),
                        new BigDecimal("100.00"),
                        "receipt-maria"
                );

                Page<Payment> matching = paymentRepository.findAllByFilters(
                        payment.getId(),
                        "maria",
                        PageRequest.of(0, 10)
                );
                Page<Payment> conflicting = paymentRepository.findAllByFilters(
                        payment.getId(),
                        "joão",
                        PageRequest.of(0, 10)
                );

                assertThat(matching.getContent()).containsExactly(payment);
                assertThat(conflicting).isEmpty();
            }

            @Test
            @DisplayName("should paginate payments")
            void shouldPaginatePayments() {
                attachPayment(
                        saveBooking(BookingStatus.CONFIRMED, "Ana"),
                        new BigDecimal("100.00"),
                        "receipt-ana"
                );
                attachPayment(
                        saveBooking(BookingStatus.CONFIRMED, "Bruno"),
                        new BigDecimal("120.00"),
                        "receipt-bruno"
                );

                Page<Payment> result =
                        paymentRepository.findAllByFilters(null, null, PageRequest.of(0, 1));

                assertThat(result.getTotalElements()).isEqualTo(2);
                assertThat(result.getTotalPages()).isEqualTo(2);
                assertThat(result.getContent()).hasSize(1);
            }
        }

        @Nested
        @DisplayName("findByStatusBooking")
        class FindByStatusBookingTests {

            @Test
            @DisplayName("should return only payments whose booking has the selected status")
            void shouldFilterPaymentsByBookingStatus() {
                Payment confirmed = attachPayment(
                        saveBooking(BookingStatus.CONFIRMED, "Ana"),
                        new BigDecimal("100.00"),
                        "receipt-ana"
                );
                attachPayment(
                        saveBooking(BookingStatus.COMPLETED, "Bruno"),
                        new BigDecimal("120.00"),
                        "receipt-bruno"
                );

                Page<Payment> result = paymentRepository.findByStatusBooking(
                        BookingStatus.CONFIRMED,
                        PageRequest.of(0, 10)
                );

                assertThat(result.getContent()).containsExactly(confirmed);
            }

            @Test
            @DisplayName("should return empty when no payment has the selected booking status")
            void shouldReturnEmptyWhenStatusDoesNotMatch() {
                attachPayment(
                        saveBooking(BookingStatus.CONFIRMED, "Ana"),
                        new BigDecimal("100.00"),
                        "receipt-ana"
                );

                assertThat(paymentRepository.findByStatusBooking(
                        BookingStatus.CANCELLED,
                        PageRequest.of(0, 10)
                )).isEmpty();
            }
        }

        @Nested
        @DisplayName("findReservationsForPayment")
        class FindReservationsForPaymentTests {

            @Test
            @DisplayName("should include bookings without a payment")
            void shouldIncludeBookingsWithoutPayment() {
                Booking draft = saveBooking(BookingStatus.DRAFT, "Ana");
                Booking confirmed = saveBooking(BookingStatus.CONFIRMED, "Bruno");
                attachPayment(confirmed, new BigDecimal("106.00"), "receipt-bruno");

                Page<Booking> result = paymentRepository.findReservationsForPayment(
                        null,
                        "",
                        PageRequest.of(0, 10)
                );

                assertThat(result.getContent())
                        .extracting(Booking::getId)
                        .containsExactlyInAnyOrder(draft.getId(), confirmed.getId());
            }

            @Test
            @DisplayName("should filter reservations by status")
            void shouldFilterReservationsByStatus() {
                Booking draft = saveBooking(BookingStatus.DRAFT, "Ana");
                saveBooking(BookingStatus.CONFIRMED, "Bruno");

                assertThat(paymentRepository.findReservationsForPayment(
                        BookingStatus.DRAFT,
                        "",
                        PageRequest.of(0, 10)
                ).getContent()).containsExactly(draft);
            }

            @Test
            @DisplayName("should search reservations by booking id, client name or phone")
            void shouldSearchReservationsBySupportedFields() {
                Booking booking = saveBooking(BookingStatus.DRAFT, "Maria da Silva");
                String phone = booking.getClient().getPhone();

                Page<Booking> byId = paymentRepository.findReservationsForPayment(
                        null,
                        booking.getId().toString(),
                        PageRequest.of(0, 10)
                );
                Page<Booking> byName = paymentRepository.findReservationsForPayment(
                        null,
                        "SILVA",
                        PageRequest.of(0, 10)
                );
                Page<Booking> byPhone = paymentRepository.findReservationsForPayment(
                        null,
                        phone.substring(phone.length() - 4),
                        PageRequest.of(0, 10)
                );

                assertThat(byId.getContent()).containsExactly(booking);
                assertThat(byName.getContent()).containsExactly(booking);
                assertThat(byPhone.getContent()).containsExactly(booking);
            }

            @Test
            @DisplayName("should require status and search to match when both are supplied")
            void shouldCombineStatusAndSearch() {
                saveBooking(BookingStatus.DRAFT, "Maria da Silva");

                assertThat(paymentRepository.findReservationsForPayment(
                        BookingStatus.CONFIRMED,
                        "Maria",
                        PageRequest.of(0, 10)
                )).isEmpty();
            }
        }

        @Nested
        @DisplayName("paymentOverview")
        class PaymentOverviewTests {

            @Test
            @DisplayName("should aggregate received, awaiting and remaining amounts by status")
            void shouldAggregateAmountsByStatus() {
                Booking draft = saveBooking(BookingStatus.DRAFT, "Ana");
                Booking confirmed = saveBooking(BookingStatus.CONFIRMED, "Bruno");
                Booking completed = saveBooking(BookingStatus.COMPLETED, "Carla");
                Booking cancelled = saveBooking(BookingStatus.CANCELLED, "Daniel");
                attachPayment(confirmed, new BigDecimal("90.00"), "receipt-bruno");
                attachPayment(completed, new BigDecimal("110.00"), "receipt-carla");
                attachPayment(cancelled, new BigDecimal("130.00"), "receipt-daniel");

                PaymentOverviewProjection result = paymentRepository.paymentOverview(
                        List.of(BookingStatus.CONFIRMED, BookingStatus.COMPLETED),
                        BookingStatus.DRAFT,
                        BookingStatus.COMPLETED
                );

                assertThat(draft.getFinancialData().totalPrice()).isEqualByComparingTo("500.00");
                assertThat(result.getReceivedDepositAmount()).isEqualByComparingTo("200.00");
                assertThat(result.getAwaitingReceiptAmount()).isEqualByComparingTo("100.00");
                assertThat(result.getRemainingAmount()).isEqualByComparingTo("400.00");
            }

            @Test
            @DisplayName("should return zero amounts when there are no bookings")
            void shouldReturnZeroAmountsWithoutBookings() {
                PaymentOverviewProjection result = paymentRepository.paymentOverview(
                        List.of(BookingStatus.CONFIRMED, BookingStatus.COMPLETED),
                        BookingStatus.DRAFT,
                        BookingStatus.COMPLETED
                );

                assertThat(result.getReceivedDepositAmount()).isEqualByComparingTo(BigDecimal.ZERO);
                assertThat(result.getAwaitingReceiptAmount()).isEqualByComparingTo(BigDecimal.ZERO);
                assertThat(result.getRemainingAmount()).isEqualByComparingTo(BigDecimal.ZERO);
            }
        }
    }

    @Nested
    @DisplayName("PaymentService")
    class PaymentServiceTests {

        @Nested
        @DisplayName("Queries")
        class QueryTests {

            @Test
            @DisplayName("should map the payment overview")
            void shouldMapPaymentOverview() {
                Booking draft = saveBooking(BookingStatus.DRAFT, "Ana");
                Booking confirmed = saveBooking(BookingStatus.CONFIRMED, "Bruno");
                Booking completed = saveBooking(BookingStatus.COMPLETED, "Carla");
                attachPayment(confirmed, new BigDecimal("90.00"), "receipt-bruno");
                attachPayment(completed, new BigDecimal("110.00"), "receipt-carla");

                PaymentOverviewDTO result = paymentService.getOverview();

                assertThat(draft.getId()).isNotNull();
                assertThat(result.receivedDepositAmount()).isEqualByComparingTo("200.00");
                assertThat(result.awaitingReceiptAmount()).isEqualByComparingTo("100.00");
                assertThat(result.remainingAmount()).isEqualByComparingTo("400.00");
            }

            @Test
            @DisplayName("should map zero overview amounts when there are no bookings")
            void shouldMapZeroOverviewWithoutBookings() {
                PaymentOverviewDTO result = paymentService.getOverview();

                assertThat(result.receivedDepositAmount()).isEqualByComparingTo(BigDecimal.ZERO);
                assertThat(result.awaitingReceiptAmount()).isEqualByComparingTo(BigDecimal.ZERO);
                assertThat(result.remainingAmount()).isEqualByComparingTo(BigDecimal.ZERO);
            }

            @Test
            @DisplayName("should normalize null search and map reservations without payment")
            void shouldNormalizeNullSearchAndMapReservations() {
                Booking booking = saveBooking(BookingStatus.DRAFT, "Ana");

                Page<ReservationPaymentDTO> result = paymentService.searchReservations(
                        BookingStatus.DRAFT,
                        null,
                        PageRequest.of(0, 10)
                );

                assertThat(result.getContent())
                        .singleElement()
                        .satisfies(reservation -> {
                            assertThat(reservation.bookingId()).isEqualTo(booking.getId());
                            assertThat(reservation.clientName()).isEqualTo("Ana");
                            assertThat(reservation.status()).isEqualTo(BookingStatus.DRAFT);
                            assertThat(reservation.signalAmount()).isEqualByComparingTo("106.00");
                            assertThat(reservation.totalPrice()).isEqualByComparingTo("530.00");
                        });
            }

            @Test
            @DisplayName("should trim search before searching reservations")
            void shouldTrimReservationSearch() {
                Booking booking = saveBooking(BookingStatus.CONFIRMED, "Maria da Silva");

                Page<ReservationPaymentDTO> result = paymentService.searchReservations(
                        null,
                        "  maria  ",
                        PageRequest.of(0, 10)
                );

                assertThat(result.getContent())
                        .extracting(ReservationPaymentDTO::bookingId)
                        .containsExactly(booking.getId());
            }

            @Test
            @DisplayName("should map paged payments filtered by client")
            void shouldMapPaymentsFilteredByClient() {
                Booking booking = saveBooking(BookingStatus.CONFIRMED, "Maria da Silva");
                Payment payment = attachPayment(booking, new BigDecimal("106.00"), "receipt-maria");

                Page<PaymentSummaryDTO> result = paymentService.findAllByNameClientOrId(
                        null,
                        "maria",
                        PageRequest.of(0, 10)
                );

                assertThat(result.getContent())
                        .singleElement()
                        .satisfies(summary -> assertPaymentSummary(summary, payment, booking));
            }

            @Test
            @DisplayName("should map payments filtered by booking status")
            void shouldMapPaymentsFilteredByStatus() {
                Booking confirmedBooking = saveBooking(BookingStatus.CONFIRMED, "Ana");
                Payment confirmedPayment =
                        attachPayment(confirmedBooking, new BigDecimal("106.00"), "receipt-ana");
                attachPayment(
                        saveBooking(BookingStatus.COMPLETED, "Bruno"),
                        new BigDecimal("120.00"),
                        "receipt-bruno"
                );

                Page<PaymentSummaryDTO> result = paymentService.findByStatusBooking(
                        BookingStatus.CONFIRMED,
                        PageRequest.of(0, 10)
                );

                assertThat(result.getContent())
                        .singleElement()
                        .satisfies(summary -> assertPaymentSummary(
                                summary,
                                confirmedPayment,
                                confirmedBooking
                        ));
            }

            @Test
            @DisplayName("should return payment details with remaining presential amount")
            void shouldReturnPaymentDetails() {
                Booking booking = saveBooking(BookingStatus.CONFIRMED, "Maria da Silva");
                booking.setFinancialData(new FinancialSnapshot(
                        new BigDecimal("250.00"),
                        new BigDecimal("500.00"),
                        new BigDecimal("50.00"),
                        new BigDecimal("50.00")
                ));
                Payment payment = attachPayment(booking, new BigDecimal("96.00"), "receipt-maria");

                PaymentDetailDTO result = paymentService.findById(payment.getId());

                assertThat(result.paymentId()).isEqualTo(payment.getId());
                assertThat(result.clientName()).isEqualTo("Maria da Silva");
                assertThat(result.tourName()).isEqualTo(booking.getTour().getName());
                assertThat(result.totalPrice()).isEqualByComparingTo("480.00");
                assertThat(result.signalAmount()).isEqualByComparingTo("96.00");
                assertThat(result.presentialAmount()).isEqualByComparingTo("384.00");
                assertThat(result.receiptUrl()).isEqualTo("receipt-maria");
                assertThat(result.paidAt()).isNotNull();
                assertThat(result.history()).isEmpty();
            }

            @Test
            @DisplayName("should throw ResourceNotFoundException when payment does not exist")
            void shouldThrowWhenPaymentDoesNotExist() {
                assertThatThrownBy(() -> paymentService.findById(NON_EXISTENT_ID))
                        .isInstanceOf(ResourceNotFoundException.class)
                        .hasMessage("Payment not found with id: " + NON_EXISTENT_ID);
            }
        }

        @Nested
        @DisplayName("createReservationPayment")
        class CreateReservationPaymentTests {

            @Test
            @DisplayName("should create a twenty percent payment considering discount and pickup fee")
            void shouldCreatePaymentFromCalculatedBookingTotal() {
                Booking booking = saveBooking(BookingStatus.CONFIRMED, "Ana");
                booking.setFinancialData(new FinancialSnapshot(
                        new BigDecimal("250.00"),
                        new BigDecimal("500.00"),
                        new BigDecimal("50.00"),
                        new BigDecimal("50.00")
                ));

                paymentService.createReservationPayment(booking, "receipt-ana");

                assertThat(booking.getPayment()).isNotNull();
                assertThat(booking.getPayment().getExpectedAmount()).isEqualByComparingTo("96.00");
                assertThat(booking.getPayment().getReceiptUrl()).isEqualTo("receipt-ana");
                assertThat(booking.getPayment().getBooking()).isSameAs(booking);
            }

            @Test
            @DisplayName("should replace an existing payment using the current booking total")
            void shouldReplaceExistingPayment() {
                Booking booking = saveBooking(BookingStatus.CONFIRMED, "Ana");
                Payment previous = attachPayment(booking, new BigDecimal("80.00"), "old-receipt");

                paymentService.createReservationPayment(booking, "new-receipt");

                assertThat(booking.getPayment()).isNotSameAs(previous);
                assertThat(booking.getPayment().getExpectedAmount()).isEqualByComparingTo("106.00");
                assertThat(booking.getPayment().getReceiptUrl()).isEqualTo("new-receipt");
            }
        }

        @Nested
        @DisplayName("updateExpectedAmount")
        class UpdateExpectedAmountTests {

            @Test
            @DisplayName("should update payment from the recalculated booking total")
            void shouldUpdateExpectedAmount() {
                Booking booking = saveBooking(BookingStatus.CONFIRMED, "Ana");
                Payment payment = attachPayment(booking, new BigDecimal("106.00"), "receipt-ana");
                booking.setFinancialData(new FinancialSnapshot(
                        new BigDecimal("250.00"),
                        new BigDecimal("750.00"),
                        new BigDecimal("75.00"),
                        new BigDecimal("30.00")
                ));

                paymentService.updateExpectedAmount(booking);

                assertThat(payment.getExpectedAmount()).isEqualByComparingTo("150.00");
            }

            @Test
            @DisplayName("should do nothing when booking has no payment")
            void shouldDoNothingWithoutPayment() {
                Booking booking = saveBooking(BookingStatus.DRAFT, "Ana");

                paymentService.updateExpectedAmount(booking);

                assertThat(booking.getPayment()).isNull();
                assertThat(paymentRepository.count()).isZero();
            }
        }
    }

    private Booking saveBooking(BookingStatus status, String clientName) {
        int sequence = DATA_SEQUENCE.incrementAndGet();
        String suffix = sequence + "-" + UUID.randomUUID();

        Permission permission = permissionRepository.save(aPermission().build());
        User attendant = aUser()
                .withEmail("attendant-" + suffix + "@example.com")
                .withPermission(permission)
                .build();
        attendant.setId(null);
        attendant.setCreatedAt(null);
        attendant = userRepository.save(attendant);

        CategoryTour category = aCategoryTour().build();
        category.setName("Categoria " + suffix);
        category = categoryRepository.save(category);

        Tour tour = aTour()
                .withName("Passeio " + suffix)
                .withCategory(category)
                .build();
        tour.setId(null);
        tour = tourRepository.save(tour);

        Client client = aClient()
                .withName(clientName)
                .withPhone(String.format("+55 73 9%08d", sequence))
                .withEmail("client-" + suffix + "@example.com")
                .build();
        client.setId(null);
        client.setCreatedAt(null);
        client = clientRepository.save(client);

        PickupLocation pickup = aPickupLocation().build();
        pickup.setId(null);
        pickup = pickupRepository.save(pickup);

        Booking booking = aBooking().build();
        booking.setId(null);
        booking.setCurrentStatus(status);
        booking.setCustomSchedule(LocalDateTime.of(2027, 2, 15, 8, 0).plusDays(sequence));
        booking.setTour(tour);
        booking.setClient(client);
        booking.setAttendant(attendant);
        booking.setPickupLocation(pickup);
        booking.setCreatedAt(null);
        booking.setUpdatedAt(null);
        return bookingRepository.saveAndFlush(booking);
    }

    private Payment attachPayment(Booking booking, BigDecimal amount, String receiptUrl) {
        Payment payment = aPayment()
                .withExpectedAmount(amount)
                .withReceiptUrl(receiptUrl)
                .withBooking(booking)
                .build();
        payment.setId(null);
        payment.setPaidAt(null);
        payment = paymentRepository.saveAndFlush(payment);
        booking.setPayment(payment);
        bookingRepository.flush();
        return payment;
    }

    private void assertPaymentSummary(
            PaymentSummaryDTO summary,
            Payment payment,
            Booking booking
    ) {
        assertThat(summary.paymentId()).isEqualTo(payment.getId());
        assertThat(summary.clientName()).isEqualTo(booking.getClient().getName());
        assertThat(summary.tourName()).isEqualTo(booking.getTour().getName());
        assertThat(summary.scheduledAt()).isEqualTo(booking.getCustomSchedule());
        assertThat(summary.signalAmount()).isEqualByComparingTo(payment.getExpectedAmount());
        assertThat(summary.totalPrice()).isEqualByComparingTo(booking.calculateTotalPrice());
        assertThat(summary.status()).isEqualTo(booking.getCurrentStatus());
    }
}

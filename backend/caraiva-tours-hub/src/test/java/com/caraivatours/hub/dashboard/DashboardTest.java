package com.caraivatours.hub.dashboard;

import com.caraivatours.hub.AbstractIntegrationTest;
import com.caraivatours.hub.auth.PermissionRepository;
import com.caraivatours.hub.auth.entity.Permission;
import com.caraivatours.hub.auth.entity.enums.UserRole;
import com.caraivatours.hub.booking.Booking;
import com.caraivatours.hub.booking.BookingRepository;
import com.caraivatours.hub.booking.embeddable.FinancialSnapshot;
import com.caraivatours.hub.booking.enums.BookingStatus;
import com.caraivatours.hub.category.CategoryTour;
import com.caraivatours.hub.category.CategoryTourRepository;
import com.caraivatours.hub.client.Client;
import com.caraivatours.hub.client.ClientRepository;
import com.caraivatours.hub.dashboard.dto.response.FinanceDashboardDTO;
import com.caraivatours.hub.dashboard.dto.response.TourDemandDTO;
import com.caraivatours.hub.dashboard.dto.response.UserDashboardDTO;
import com.caraivatours.hub.dashboard.projection.EmployeeMetricsProjection;
import com.caraivatours.hub.dashboard.projection.FinanceMetricsProjection;
import com.caraivatours.hub.pickuplocation.PickupLocation;
import com.caraivatours.hub.pickuplocation.PickupLocationRepository;
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
import org.springframework.test.context.ActiveProfiles;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.time.DayOfWeek;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.YearMonth;
import java.time.temporal.TemporalAdjusters;
import java.util.List;
import java.util.UUID;
import java.util.concurrent.atomic.AtomicInteger;

import static com.caraivatours.hub.support.fixtures.BookingTestDataBuilder.aBooking;
import static com.caraivatours.hub.support.fixtures.CategoryTourTestDataBuilder.aCategoryTour;
import static com.caraivatours.hub.support.fixtures.ClientTestDataBuilder.aClient;
import static com.caraivatours.hub.support.fixtures.PickupLocationTestDataBuilder.aPickupLocation;
import static com.caraivatours.hub.support.fixtures.TourTestDataBuilder.aTour;
import static com.caraivatours.hub.support.fixtures.UserTestDataBuilder.aUser;
import static org.assertj.core.api.Assertions.assertThat;

@SpringBootTest
@ActiveProfiles("test")
@Transactional
@DisplayName("Dashboard integration tests")
class DashboardTest extends AbstractIntegrationTest {

    private static final AtomicInteger DATA_SEQUENCE = new AtomicInteger();
    private static final YearMonth REPORT_MONTH = YearMonth.of(2026, 5);
    private static final LocalDateTime REPORT_START = REPORT_MONTH.atDay(1).atStartOfDay();
    private static final LocalDateTime REPORT_END = REPORT_MONTH.plusMonths(1).atDay(1).atStartOfDay();
    private static final List<BookingStatus> REVENUE_STATUSES =
            List.of(BookingStatus.COMPLETED, BookingStatus.CONFIRMED);

    @Autowired
    private BookingRepository bookingRepository;

    @Autowired
    private DashboardService dashboardService;

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
    @DisplayName("BookingRepository dashboard queries")
    class BookingRepositoryDashboardTests {

        @Nested
        @DisplayName("employeeMetrics")
        class EmployeeMetricsTests {

            @Test
            @DisplayName("should aggregate revenue and status counters for one attendant and period")
            void shouldAggregateEmployeeMetrics() {
                User attendant = saveUser();
                User anotherAttendant = saveUser();
                Tour tour = saveTour("Corumbau");
                saveBooking(attendant, tour, BookingStatus.CONFIRMED, REPORT_START.plusDays(1), "500.00", "50.00");
                saveBooking(attendant, tour, BookingStatus.COMPLETED, REPORT_START.plusDays(2), "700.00", "70.00");
                saveBooking(attendant, tour, BookingStatus.DRAFT, REPORT_START.plusDays(3), "300.00", "30.00");
                saveBooking(attendant, tour, BookingStatus.CANCELLED, REPORT_START.plusDays(4), "900.00", "90.00");
                saveBooking(anotherAttendant, tour, BookingStatus.CONFIRMED, REPORT_START.plusDays(1), "800.00", "80.00");
                saveBooking(attendant, tour, BookingStatus.CONFIRMED, REPORT_END.plusDays(1), "600.00", "60.00");

                EmployeeMetricsProjection result = bookingRepository.employeeMetrics(
                        attendant.getId(),
                        REPORT_START,
                        REPORT_END,
                        REVENUE_STATUSES,
                        BookingStatus.CONFIRMED,
                        BookingStatus.DRAFT
                );

                assertThat(result.getCommissionRevenue()).isEqualByComparingTo("120.00");
                assertThat(result.getCompletedTours()).isEqualTo(1);
                assertThat(result.getPendingDrafts()).isEqualTo(1);
            }

            @Test
            @DisplayName("should include start and exclude end of period")
            void shouldRespectHalfOpenPeriod() {
                User attendant = saveUser();
                Tour tour = saveTour("Corumbau");
                saveBooking(attendant, tour, BookingStatus.CONFIRMED, REPORT_START, "500.00", "50.00");
                saveBooking(attendant, tour, BookingStatus.CONFIRMED, REPORT_END, "700.00", "70.00");

                EmployeeMetricsProjection result = bookingRepository.employeeMetrics(
                        attendant.getId(),
                        REPORT_START,
                        REPORT_END,
                        REVENUE_STATUSES,
                        BookingStatus.CONFIRMED,
                        BookingStatus.DRAFT
                );

                assertThat(result.getCommissionRevenue()).isEqualByComparingTo("50.00");
                assertThat(result.getCompletedTours()).isEqualTo(1);
            }
        }

        @Nested
        @DisplayName("financeMetrics")
        class FinanceMetricsTests {

            @Test
            @DisplayName("should apply each status rule to financial metrics")
            void shouldAggregateFinanceMetricsByStatus() {
                User attendant = saveUser();
                Tour tour = saveTour("Corumbau");
                saveBooking(attendant, tour, BookingStatus.CONFIRMED, REPORT_START.plusDays(1), "500.00", "50.00");
                saveBooking(attendant, tour, BookingStatus.COMPLETED, REPORT_START.plusDays(2), "700.00", "70.00");
                saveBooking(attendant, tour, BookingStatus.DRAFT, REPORT_START.plusDays(3), "300.00", "30.00");
                saveBooking(attendant, tour, BookingStatus.CANCELLED, REPORT_START.plusDays(4), "900.00", "90.00");
                saveBooking(attendant, tour, BookingStatus.CANCEL_REQUEST, REPORT_START.plusDays(5), "200.00", "20.00");

                FinanceMetricsProjection result = bookingRepository.financeMetrics(
                        REPORT_START,
                        REPORT_END,
                        REVENUE_STATUSES,
                        BookingStatus.DRAFT,
                        BookingStatus.CANCELLED
                );

                assertThat(result.getConfirmedRevenue()).isEqualByComparingTo("1200.00");
                assertThat(result.getReceivable()).isEqualByComparingTo("300.00");
                assertThat(result.getCancelledOrders()).isEqualTo(1);
                assertThat(result.getGrossRevenue()).isEqualByComparingTo("1700.00");
            }

            @Test
            @DisplayName("should return zero metrics when period has no bookings")
            void shouldReturnZeroFinanceMetricsWithoutBookings() {
                FinanceMetricsProjection result = bookingRepository.financeMetrics(
                        REPORT_START,
                        REPORT_END,
                        REVENUE_STATUSES,
                        BookingStatus.DRAFT,
                        BookingStatus.CANCELLED
                );

                assertThat(result.getConfirmedRevenue()).isEqualByComparingTo(BigDecimal.ZERO);
                assertThat(result.getReceivable()).isEqualByComparingTo(BigDecimal.ZERO);
                assertThat(result.getCancelledOrders()).isZero();
                assertThat(result.getGrossRevenue()).isEqualByComparingTo(BigDecimal.ZERO);
            }
        }

        @Nested
        @DisplayName("commissionByStatus")
        class CommissionByStatusTests {

            @Test
            @DisplayName("should group commissions by status for the selected attendant")
            void shouldGroupCommissionByStatus() {
                User attendant = saveUser();
                User anotherAttendant = saveUser();
                Tour tour = saveTour("Corumbau");
                saveBooking(attendant, tour, BookingStatus.DRAFT, REPORT_START.plusDays(1), "300.00", "30.00");
                saveBooking(attendant, tour, BookingStatus.DRAFT, REPORT_START.plusDays(2), "400.00", "40.00");
                saveBooking(attendant, tour, BookingStatus.CONFIRMED, REPORT_START.plusDays(3), "500.00", "50.00");
                saveBooking(anotherAttendant, tour, BookingStatus.DRAFT, REPORT_START.plusDays(1), "900.00", "90.00");

                var result = bookingRepository.commissionByStatus(
                        attendant.getId(),
                        REPORT_START,
                        REPORT_END
                );

                assertThat(result).hasSize(2);
                assertThat(result)
                        .filteredOn(item -> item.getStatus() == BookingStatus.DRAFT)
                        .singleElement()
                        .extracting(item -> item.getAmount())
                        .isEqualTo(new BigDecimal("70.00"));
                assertThat(result)
                        .filteredOn(item -> item.getStatus() == BookingStatus.CONFIRMED)
                        .singleElement()
                        .extracting(item -> item.getAmount())
                        .isEqualTo(new BigDecimal("50.00"));
            }
        }

        @Nested
        @DisplayName("mostRequestedTours")
        class MostRequestedToursTests {

            @Test
            @DisplayName("should count and order tours by demand")
            void shouldCountAndOrderToursByDemand() {
                User attendant = saveUser();
                Tour corumbau = saveTour("Corumbau");
                Tour espelho = saveTour("Espelho");
                saveBooking(attendant, corumbau, BookingStatus.DRAFT, REPORT_START.plusDays(1), "300.00", "30.00");
                saveBooking(attendant, corumbau, BookingStatus.CONFIRMED, REPORT_START.plusDays(2), "500.00", "50.00");
                saveBooking(attendant, espelho, BookingStatus.CANCELLED, REPORT_START.plusDays(3), "400.00", "40.00");

                var result = bookingRepository.mostRequestedTours(
                        attendant.getId(),
                        REPORT_START,
                        REPORT_END
                );

                assertThat(result).hasSize(2);
                assertThat(result.getFirst().getTourId()).isEqualTo(corumbau.getId());
                assertThat(result.getFirst().getBookingCount()).isEqualTo(2);
                assertThat(result.get(1).getTourId()).isEqualTo(espelho.getId());
                assertThat(result.get(1).getBookingCount()).isEqualTo(1);
            }
        }

        @Nested
        @DisplayName("confirmedTourRevenue")
        class ConfirmedTourRevenueTests {

            @Test
            @DisplayName("should sum only confirmed bookings and order tours by revenue")
            void shouldAggregateConfirmedRevenueByTour() {
                User attendant = saveUser();
                Tour corumbau = saveTour("Corumbau");
                Tour espelho = saveTour("Espelho");
                saveBooking(attendant, corumbau, BookingStatus.CONFIRMED, REPORT_START.plusDays(1), "300.00", "30.00");
                saveBooking(attendant, corumbau, BookingStatus.CONFIRMED, REPORT_START.plusDays(2), "500.00", "50.00");
                saveBooking(attendant, corumbau, BookingStatus.COMPLETED, REPORT_START.plusDays(3), "900.00", "90.00");
                saveBooking(attendant, espelho, BookingStatus.CONFIRMED, REPORT_START.plusDays(4), "600.00", "60.00");

                var result = bookingRepository.confirmedTourRevenue(
                        BookingStatus.CONFIRMED,
                        REPORT_START,
                        REPORT_END
                );

                assertThat(result).hasSize(2);
                assertThat(result.getFirst().getTourId()).isEqualTo(corumbau.getId());
                assertThat(result.getFirst().getRevenue()).isEqualByComparingTo("800.00");
                assertThat(result.get(1).getTourId()).isEqualTo(espelho.getId());
                assertThat(result.get(1).getRevenue()).isEqualByComparingTo("600.00");
            }
        }

        @Nested
        @DisplayName("weeklyRevenue")
        class WeeklyRevenueTests {

            @Test
            @DisplayName("should group confirmed and completed revenue by day")
            void shouldGroupWeeklyRevenueByDay() {
                User attendant = saveUser();
                User anotherAttendant = saveUser();
                Tour tour = saveTour("Corumbau");
                LocalDate monday = currentMonday();
                saveBooking(attendant, tour, BookingStatus.CONFIRMED, monday.atTime(9, 0), "300.00", "30.00");
                saveBooking(attendant, tour, BookingStatus.COMPLETED, monday.atTime(15, 0), "500.00", "50.00");
                saveBooking(attendant, tour, BookingStatus.DRAFT, monday.plusDays(1).atTime(9, 0), "900.00", "90.00");
                saveBooking(attendant, tour, BookingStatus.CONFIRMED, monday.plusDays(2).atTime(9, 0), "600.00", "60.00");
                saveBooking(anotherAttendant, tour, BookingStatus.CONFIRMED, monday.atTime(9, 0), "700.00", "70.00");

                var result = bookingRepository.weeklyRevenue(
                        attendant.getId(),
                        monday.atStartOfDay(),
                        monday.plusDays(7).atStartOfDay()
                );

                assertThat(result).hasSize(2);
                assertThat(result.getFirst().getDay().toLocalDate()).isEqualTo(monday);
                assertThat(result.getFirst().getRevenue()).isEqualByComparingTo("800.00");
                assertThat(result.get(1).getDay().toLocalDate()).isEqualTo(monday.plusDays(2));
                assertThat(result.get(1).getRevenue()).isEqualByComparingTo("600.00");
            }
        }

        @Nested
        @DisplayName("recent booking queries")
        class RecentBookingQueriesTests {

            @Test
            @DisplayName("should count only today's bookings for the attendant")
            void shouldCountTodayBookings() {
                User attendant = saveUser();
                User anotherAttendant = saveUser();
                Tour tour = saveTour("Corumbau");
                LocalDate today = LocalDate.now();
                saveBooking(attendant, tour, BookingStatus.DRAFT, today.atTime(8, 0), "300.00", "30.00");
                saveBooking(attendant, tour, BookingStatus.CONFIRMED, today.atTime(18, 0), "500.00", "50.00");
                saveBooking(attendant, tour, BookingStatus.CONFIRMED, today.minusDays(1).atTime(18, 0), "500.00", "50.00");
                saveBooking(anotherAttendant, tour, BookingStatus.DRAFT, today.atTime(8, 0), "300.00", "30.00");

                long result = bookingRepository
                        .countByAttendantIdAndCreatedAtGreaterThanEqualAndCreatedAtLessThan(
                                attendant.getId(),
                                today.atStartOfDay(),
                                today.plusDays(1).atStartOfDay()
                        );

                assertThat(result).isEqualTo(2);
            }

            @Test
            @DisplayName("should return at most five latest bookings for the attendant")
            void shouldReturnFiveLatestBookings() {
                User attendant = saveUser();
                User anotherAttendant = saveUser();
                Tour tour = saveTour("Corumbau");
                LocalDateTime base = LocalDateTime.now().minusDays(10);
                for (int index = 0; index < 6; index++) {
                    saveBooking(
                            attendant,
                            tour,
                            BookingStatus.DRAFT,
                            base.plusDays(index),
                            String.valueOf(300 + index),
                            "30.00"
                    );
                }
                saveBooking(anotherAttendant, tour, BookingStatus.DRAFT, base.plusDays(7), "900.00", "90.00");

                List<Booking> result =
                        bookingRepository.findTop5ByAttendantIdOrderByCreatedAtDesc(attendant.getId());

                assertThat(result).hasSize(5);
                assertThat(result)
                        .extracting(Booking::getCreatedAt)
                        .isSortedAccordingTo((first, second) -> second.compareTo(first));
                assertThat(result).allMatch(booking -> booking.getAttendant().getId().equals(attendant.getId()));
            }
        }
    }

    @Nested
    @DisplayName("DashboardService")
    class DashboardServiceTests {

        @Nested
        @DisplayName("getUserDashboard")
        class GetUserDashboardTests {

            @Test
            @DisplayName("should assemble every user metric for the selected month")
            void shouldAssembleUserDashboard() {
                User attendant = saveUser();
                Tour corumbau = saveTour("Corumbau");
                Tour espelho = saveTour("Espelho");
                LocalDate today = LocalDate.now();
                LocalDate monday = today.with(TemporalAdjusters.previousOrSame(DayOfWeek.MONDAY));
                long expectedTodayBookings =
                        today.equals(monday) || today.equals(monday.plusDays(2)) ? 2 : 1;

                saveBooking(attendant, corumbau, BookingStatus.CONFIRMED, REPORT_START.plusDays(1), "500.00", "50.00");
                saveBooking(attendant, corumbau, BookingStatus.COMPLETED, REPORT_START.plusDays(2), "700.00", "70.00");
                saveBooking(attendant, espelho, BookingStatus.DRAFT, REPORT_START.plusDays(3), "300.00", "30.00");
                saveBooking(attendant, corumbau, BookingStatus.CONFIRMED, monday.atTime(10, 0), "400.00", "40.00");
                saveBooking(attendant, espelho, BookingStatus.COMPLETED, monday.plusDays(2).atTime(10, 0), "600.00", "60.00");
                saveBooking(attendant, espelho, BookingStatus.DRAFT, today.atTime(12, 0), "200.00", "20.00");

                UserDashboardDTO result =
                        dashboardService.getUserDashboard(attendant.getId(), REPORT_MONTH, false);

                assertThat(result.monthlyRevenue()).isEqualByComparingTo("120.00");
                assertThat(result.pendingCommissions()).isEqualByComparingTo("30.00");
                assertThat(result.employeeMetrics().monthlyCommissionRevenue()).isEqualByComparingTo("120.00");
                assertThat(result.employeeMetrics().completedTours()).isEqualTo(1);
                assertThat(result.employeeMetrics().pendingDraftBookings()).isEqualTo(1);
                assertThat(result.confirmationStatus()).hasSize(3);
                assertThat(result.todayBookings()).isEqualTo(expectedTodayBookings);
                assertThat(result.latestBookings()).hasSize(5);

                assertThat(result.mostRequestedTours()).hasSize(2);
                TourDemandDTO mostRequested = result.mostRequestedTours().getFirst();
                assertThat(mostRequested.tourId()).isEqualTo(corumbau.getId());
                assertThat(mostRequested.bookingCount()).isEqualTo(2);
                assertThat(mostRequested.percentage()).isEqualTo(66.67);
                assertThat(result.mostRequestedTours().get(1).percentage()).isEqualTo(33.33);

                assertThat(result.weeklyRevenue()).hasSize(7);
                assertThat(result.weeklyRevenue().getFirst().day()).isEqualTo(monday);
                assertThat(result.weeklyRevenue())
                        .filteredOn(item -> item.day().equals(monday))
                        .singleElement()
                        .extracting(item -> item.revenue())
                        .isEqualTo(new BigDecimal("400.00"));
                assertThat(result.weeklyRevenue())
                        .filteredOn(item -> item.day().equals(monday.plusDays(2)))
                        .singleElement()
                        .extracting(item -> item.revenue())
                        .isEqualTo(new BigDecimal("600.00"));
            }

            @Test
            @DisplayName("should return zero-filled dashboard when user has no bookings")
            void shouldReturnEmptyUserDashboard() {
                User attendant = saveUser();

                UserDashboardDTO result =
                        dashboardService.getUserDashboard(attendant.getId(), REPORT_MONTH, false);

                assertThat(result.monthlyRevenue()).isEqualByComparingTo(BigDecimal.ZERO);
                assertThat(result.todayBookings()).isZero();
                assertThat(result.pendingCommissions()).isEqualByComparingTo(BigDecimal.ZERO);
                assertThat(result.confirmationStatus()).isEmpty();
                assertThat(result.mostRequestedTours()).isEmpty();
                assertThat(result.latestBookings()).isEmpty();
                assertThat(result.weeklyRevenue()).hasSize(7);
                assertThat(result.weeklyRevenue())
                        .allMatch(item -> item.revenue().compareTo(BigDecimal.ZERO) == 0);
                assertThat(result.employeeMetrics().completedTours()).isZero();
                assertThat(result.employeeMetrics().pendingDraftBookings()).isZero();
            }

            @Test
            @DisplayName("should use current month when month is null")
            void shouldDefaultToCurrentMonth() {
                User attendant = saveUser();
                Tour tour = saveTour("Corumbau");
                saveBooking(
                        attendant,
                        tour,
                        BookingStatus.CONFIRMED,
                        YearMonth.now().atDay(1).atTime(10, 0),
                        "500.00",
                        "50.00"
                );
                saveBooking(attendant, tour, BookingStatus.CONFIRMED, REPORT_START.plusDays(1), "700.00", "70.00");

                UserDashboardDTO result =
                        dashboardService.getUserDashboard(attendant.getId(), null, false);

                assertThat(result.monthlyRevenue()).isEqualByComparingTo("50.00");
            }

            @Test
            @DisplayName("should include historical bookings when all is true")
            void shouldIncludeAllHistoricalBookings() {
                User attendant = saveUser();
                Tour tour = saveTour("Corumbau");
                saveBooking(attendant, tour, BookingStatus.CONFIRMED, REPORT_START.plusDays(1), "500.00", "50.00");
                saveBooking(attendant, tour, BookingStatus.COMPLETED, LocalDateTime.now().minusDays(2), "700.00", "70.00");

                UserDashboardDTO result =
                        dashboardService.getUserDashboard(attendant.getId(), REPORT_MONTH, true);

                assertThat(result.monthlyRevenue()).isEqualByComparingTo("120.00");
                assertThat(result.employeeMetrics().completedTours()).isEqualTo(1);
            }
        }

        @Nested
        @DisplayName("getFinanceDashboard")
        class GetFinanceDashboardTests {

            @Test
            @DisplayName("should assemble finance metrics and confirmed revenue by tour")
            void shouldAssembleFinanceDashboard() {
                User attendant = saveUser();
                Tour corumbau = saveTour("Corumbau");
                Tour espelho = saveTour("Espelho");
                saveBooking(attendant, corumbau, BookingStatus.CONFIRMED, REPORT_START.plusDays(1), "500.00", "50.00");
                saveBooking(attendant, corumbau, BookingStatus.CONFIRMED, REPORT_START.plusDays(2), "300.00", "30.00");
                saveBooking(attendant, espelho, BookingStatus.CONFIRMED, REPORT_START.plusDays(3), "600.00", "60.00");
                saveBooking(attendant, espelho, BookingStatus.COMPLETED, REPORT_START.plusDays(4), "700.00", "70.00");
                saveBooking(attendant, espelho, BookingStatus.DRAFT, REPORT_START.plusDays(5), "200.00", "20.00");
                saveBooking(attendant, espelho, BookingStatus.CANCELLED, REPORT_START.plusDays(6), "900.00", "90.00");

                FinanceDashboardDTO result =
                        dashboardService.getFinanceDashboard(REPORT_MONTH, false);

                assertThat(result.confirmedRevenue()).isEqualByComparingTo("2100.00");
                assertThat(result.receivable()).isEqualByComparingTo("200.00");
                assertThat(result.cancelledOrders()).isEqualTo(1);
                assertThat(result.grossRevenue()).isEqualByComparingTo("2300.00");
                assertThat(result.confirmedTourRevenue()).hasSize(2);
                assertThat(result.confirmedTourRevenue().getFirst().tourId()).isEqualTo(corumbau.getId());
                assertThat(result.confirmedTourRevenue().getFirst().revenue()).isEqualByComparingTo("800.00");
                assertThat(result.confirmedTourRevenue().get(1).tourId()).isEqualTo(espelho.getId());
                assertThat(result.confirmedTourRevenue().get(1).revenue()).isEqualByComparingTo("600.00");
                assertThat(result.mostRequestedTours()).hasSize(2);
                assertThat(result.mostRequestedTours().getFirst().tourId()).isEqualTo(espelho.getId());
                assertThat(result.mostRequestedTours().getFirst().bookingCount()).isEqualTo(4);
                assertThat(result.employeeRanking()).singleElement().satisfies(employee -> {
                    assertThat(employee.rankingPosition()).isEqualTo(1);
                    assertThat(employee.employeeId()).isEqualTo(attendant.getId());
                    assertThat(employee.totalSales()).isEqualByComparingTo("2100.00");
                    assertThat(employee.totalCommission()).isEqualByComparingTo("210.00");
                    assertThat(employee.bookingCount()).isEqualTo(4);
                });
            }

            @Test
            @DisplayName("should return zero-filled finance dashboard without bookings")
            void shouldReturnEmptyFinanceDashboard() {
                FinanceDashboardDTO result =
                        dashboardService.getFinanceDashboard(REPORT_MONTH, false);

                assertThat(result.confirmedRevenue()).isEqualByComparingTo(BigDecimal.ZERO);
                assertThat(result.receivable()).isEqualByComparingTo(BigDecimal.ZERO);
                assertThat(result.cancelledOrders()).isZero();
                assertThat(result.grossRevenue()).isEqualByComparingTo(BigDecimal.ZERO);
                assertThat(result.confirmedTourRevenue()).isEmpty();
                assertThat(result.mostRequestedTours()).isEmpty();
                assertThat(result.employeeRanking()).isEmpty();
            }

            @Test
            @DisplayName("should include historical finance data when all is true")
            void shouldIncludeAllHistoricalFinanceData() {
                User attendant = saveUser();
                Tour tour = saveTour("Corumbau");
                saveBooking(attendant, tour, BookingStatus.CONFIRMED, REPORT_START.plusDays(1), "500.00", "50.00");
                saveBooking(attendant, tour, BookingStatus.COMPLETED, LocalDateTime.now().minusDays(2), "700.00", "70.00");

                FinanceDashboardDTO result =
                        dashboardService.getFinanceDashboard(REPORT_MONTH, true);

                assertThat(result.confirmedRevenue()).isEqualByComparingTo("1200.00");
                assertThat(result.grossRevenue()).isEqualByComparingTo("1200.00");
                assertThat(result.confirmedTourRevenue())
                        .singleElement()
                        .extracting(item -> item.revenue())
                        .isEqualTo(new BigDecimal("500.00"));
            }
        }
    }

    private User saveUser() {
        String suffix = UUID.randomUUID().toString();
        Permission permission = requirePermission(UserRole.EMPLOYEE);
        User user = aUser()
                .withEmail("dashboard-" + suffix + "@example.com")
                .withPermission(permission)
                .build();
        user.setId(null);
        user.setUserName("dashboard-" + suffix);
        user.setCreatedAt(null);
        return userRepository.save(user);
    }

    private Permission requirePermission(UserRole role) {
        return permissionRepository.findByRole(role)
                .orElseThrow(() -> new AssertionError("Seeded permission not found: " + role));
    }

    private Tour saveTour(String name) {
        String suffix = UUID.randomUUID().toString();
        CategoryTour category = aCategoryTour().build();
        category.setName("Categoria " + suffix);
        category = categoryRepository.save(category);

        Tour tour = aTour()
                .withName(name + " " + suffix)
                .withCategory(category)
                .build();
        tour.setId(null);
        return tourRepository.save(tour);
    }

    private Booking saveBooking(
            User attendant,
            Tour tour,
            BookingStatus status,
            LocalDateTime createdAt,
            String totalPrice,
            String commission
    ) {
        int sequence = DATA_SEQUENCE.incrementAndGet();
        String suffix = sequence + "-" + UUID.randomUUID();

        Client client = aClient()
                .withName("Cliente " + sequence)
                .withPhone(String.format("+55 73 9%08d", sequence))
                .withEmail("dashboard-client-" + suffix + "@example.com")
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
        booking.setCustomSchedule(createdAt.plusMonths(1));
        booking.setFinancialData(new FinancialSnapshot(
                new BigDecimal("250.00"),
                new BigDecimal(totalPrice),
                new BigDecimal(commission),
                BigDecimal.ZERO
        ));
        booking.setTour(tour);
        booking.setClient(client);
        booking.setAttendant(attendant);
        booking.setPickupLocation(pickup);
        booking.setCreatedAt(null);
        booking.setUpdatedAt(null);
        booking = bookingRepository.saveAndFlush(booking);

        entityManager.createNativeQuery("""
                        UPDATE booking
                        SET created_at = :createdAt
                        WHERE booking_id = :bookingId
                        """)
                .setParameter("createdAt", createdAt)
                .setParameter("bookingId", booking.getId())
                .executeUpdate();
        entityManager.refresh(booking);
        return booking;
    }

    private LocalDate currentMonday() {
        return LocalDate.now().with(TemporalAdjusters.previousOrSame(DayOfWeek.MONDAY));
    }
}

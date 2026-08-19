package com.caraivatours.hub.groupmember;

import com.caraivatours.hub.AbstractIntegrationTest;
import com.caraivatours.hub.auth.PermissionRepository;
import com.caraivatours.hub.auth.entity.Permission;
import com.caraivatours.hub.booking.Booking;
import com.caraivatours.hub.booking.BookingRepository;
import com.caraivatours.hub.booking.enums.BookingStatus;
import com.caraivatours.hub.category.CategoryTour;
import com.caraivatours.hub.category.CategoryTourRepository;
import com.caraivatours.hub.client.Client;
import com.caraivatours.hub.client.ClientRepository;
import com.caraivatours.hub.groupmember.dto.GroupMemberDTO;
import com.caraivatours.hub.pickuplocation.PickupLocation;
import com.caraivatours.hub.pickuplocation.PickupLocationRepository;
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
import org.springframework.test.context.ActiveProfiles;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;

import static com.caraivatours.hub.support.fixtures.BookingTestDataBuilder.aBooking;
import static com.caraivatours.hub.support.fixtures.CategoryTourTestDataBuilder.aCategoryTour;
import static com.caraivatours.hub.support.fixtures.ClientTestDataBuilder.aClient;
import static com.caraivatours.hub.support.fixtures.GroupMemberTestDataBuilder.aGroupMember;
import static com.caraivatours.hub.support.fixtures.PickupLocationTestDataBuilder.aPickupLocation;
import static com.caraivatours.hub.support.fixtures.TourTestDataBuilder.aTour;
import static com.caraivatours.hub.support.fixtures.UserTestDataBuilder.aUser;
import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;

@SpringBootTest
@ActiveProfiles("test")
@Transactional
@DisplayName("Group member integration tests")
class GroupMemberTest extends AbstractIntegrationTest {

    private static final long NON_EXISTENT_ID = 999_999L;

    @Autowired
    private GroupMemberRepository groupMemberRepository;

    @Autowired
    private GroupMemberService groupMemberService;

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
    @DisplayName("GroupMemberRepository")
    class GroupMemberRepositoryTests {

        @Nested
        @DisplayName("Persistence")
        class PersistenceTests {

            @Test
            @DisplayName("should save and find a group member by id")
            void shouldSaveAndFindGroupMemberById() {
                Booking booking = saveBooking(BookingStatus.DRAFT);
                GroupMember saved = saveMember(aGroupMember()
                        .withBooking(booking)
                        .lapChild(true)
                        .build());
                entityManager.clear();

                assertThat(groupMemberRepository.findById(saved.getId()))
                        .isPresent()
                        .get()
                        .satisfies(member -> {
                            assertThat(member.getName()).isEqualTo("Pedro dos Santos");
                            assertThat(member.isLapChild()).isTrue();
                            assertThat(member.getBooking().getId()).isEqualTo(booking.getId());
                        });
            }
        }

        @Nested
        @DisplayName("findByBookingId")
        class FindByBookingIdTests {

            @Test
            @DisplayName("should return only members from the selected booking")
            void shouldReturnOnlyMembersFromSelectedBooking() {
                Booking firstBooking = saveBooking(BookingStatus.DRAFT);
                Booking secondBooking = saveBooking(BookingStatus.CONFIRMED);
                saveMember(aGroupMember().withName("Ana").withBooking(firstBooking).build());
                saveMember(aGroupMember().withName("Bruno").withBooking(firstBooking).lapChild(true).build());
                saveMember(aGroupMember().withName("Carla").withBooking(secondBooking).build());

                assertThat(groupMemberRepository.findByBookingIdOrderByIdAsc(firstBooking.getId()))
                        .extracting(GroupMember::getName)
                        .containsExactlyInAnyOrder("Ana", "Bruno");
            }

            @Test
            @DisplayName("should return an empty set when booking has no members")
            void shouldReturnEmptySetWhenBookingHasNoMembers() {
                Booking booking = saveBooking(BookingStatus.DRAFT);

                assertThat(groupMemberRepository.findByBookingIdOrderByIdAsc(booking.getId())).isEmpty();
            }

            @Test
            @DisplayName("should return an empty set when booking does not exist")
            void shouldReturnEmptySetWhenBookingDoesNotExist() {
                assertThat(groupMemberRepository.findByBookingIdOrderByIdAsc(NON_EXISTENT_ID)).isEmpty();
            }
        }
    }

    @Nested
    @DisplayName("GroupMemberService")
    class GroupMemberServiceTests {

        @Nested
        @DisplayName("findGroupMembers")
        class FindGroupMembersTests {

            @Test
            @DisplayName("should return all members preserving lap child information")
            void shouldReturnAllMembers() {
                Booking booking = saveBooking(BookingStatus.DRAFT);
                saveMember(aGroupMember().withName("Ana").withBooking(booking).build());
                saveMember(aGroupMember().withName("Bruno").withBooking(booking).lapChild(true).build());

                List<GroupMemberDTO> result = groupMemberService.findGroupMembers(booking.getId());

                assertThat(result).containsExactly(
                        new GroupMemberDTO("Ana", false),
                        new GroupMemberDTO("Bruno", true)
                );
            }

            @Test
            @DisplayName("should return an empty set when booking has no members")
            void shouldReturnEmptySetWhenBookingHasNoMembers() {
                Booking booking = saveBooking(BookingStatus.DRAFT);

                assertThat(groupMemberService.findGroupMembers(booking.getId())).isEmpty();
            }

            @Test
            @DisplayName("should throw ResourceNotFoundException when booking does not exist")
            void shouldThrowWhenBookingDoesNotExist() {
                assertThatThrownBy(() -> groupMemberService.findGroupMembers(NON_EXISTENT_ID))
                        .isInstanceOf(ResourceNotFoundException.class)
                        .hasMessage("Booking not found with ID: " + NON_EXISTENT_ID);
            }

            @ParameterizedTest(name = "should reject access when booking status is {0}")
            @EnumSource(
                    value = BookingStatus.class,
                    names = {"COMPLETED", "CANCELLED", "CANCEL_REQUEST"}
            )
            void shouldRejectBlockedBookingStatuses(BookingStatus status) {
                Booking booking = saveBooking(status);
                saveMember(aGroupMember().withBooking(booking).build());

                assertThatThrownBy(() -> groupMemberService.findGroupMembers(booking.getId()))
                        .isInstanceOf(BadRequestException.class)
                        .hasMessage("This Booking cannot be changed/accessed because its status is: " + status.name());
            }

            @ParameterizedTest(name = "should allow access when booking status is {0}")
            @EnumSource(value = BookingStatus.class, names = {"DRAFT", "CONFIRMED"})
            void shouldAllowMutableBookingStatuses(BookingStatus status) {
                Booking booking = saveBooking(status);
                saveMember(aGroupMember().withBooking(booking).build());

                assertThat(groupMemberService.findGroupMembers(booking.getId()))
                        .containsExactly(new GroupMemberDTO("Pedro dos Santos", false));
            }
        }

        @Nested
        @DisplayName("createForBooking")
        class CreateForBookingTests {

            @Test
            @DisplayName("should return an empty immutable list when members are null")
            void shouldReturnEmptySetWhenMembersAreNull() {
                Booking booking = aBooking().build();

                List<GroupMember> result = groupMemberService.createForBooking(booking, null);

                assertThat(result).isEmpty();
                assertThatThrownBy(() -> result.add(new GroupMember()))
                        .isInstanceOf(UnsupportedOperationException.class);
            }

            @Test
            @DisplayName("should return an empty immutable list when members are empty")
            void shouldReturnEmptySetWhenMembersAreEmpty() {
                Booking booking = aBooking().build();

                List<GroupMember> result = groupMemberService.createForBooking(booking, List.of());

                assertThat(result).isEmpty();
                assertThatThrownBy(() -> result.add(new GroupMember()))
                        .isInstanceOf(UnsupportedOperationException.class);
            }

            @Test
            @DisplayName("should map member data and associate the booking without persisting")
            void shouldMapAndAssociateMemberWithoutPersisting() {
                Booking booking = aBooking().build();

                List<GroupMember> result = groupMemberService.createForBooking(
                        booking,
                        List.of(new GroupMemberDTO("Ana", true))
                );

                assertThat(result)
                        .singleElement()
                        .satisfies(member -> {
                            assertThat(member.getId()).isNull();
                            assertThat(member.getName()).isEqualTo("Ana");
                            assertThat(member.isLapChild()).isTrue();
                            assertThat(member.getBooking()).isSameAs(booking);
                        });
                assertThat(groupMemberRepository.count()).isZero();
            }

            @Test
            @DisplayName("should create every distinct member from the request")
            void shouldCreateEveryDistinctMember() {
                Booking booking = aBooking().build();

                List<GroupMember> result = groupMemberService.createForBooking(
                        booking,
                        List.of(
                                new GroupMemberDTO("Ana", false),
                                new GroupMemberDTO("Bruno", true)
                        )
                );

                assertThat(result)
                        .hasSize(2)
                        .extracting(GroupMember::getName)
                        .containsExactly("Ana", "Bruno");
                assertThat(result).allMatch(member -> member.getBooking() == booking);
            }
        }
    }

    private Booking saveBooking(BookingStatus status) {
        String suffix = UUID.randomUUID().toString();

        Permission permission = permissionRepository.findByRole(com.caraivatours.hub.auth.entity.enums.UserRole.EMPLOYEE)
                .orElseThrow(() -> new AssertionError("Seeded EMPLOYEE permission not found"));
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
                .withPhone("+55" + Math.abs(suffix.hashCode()))
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
        booking.setCustomSchedule(LocalDateTime.of(2027, 2, 15, 8, 0));
        booking.setTour(tour);
        booking.setClient(client);
        booking.setAttendant(attendant);
        booking.setPickupLocation(pickup);
        booking.setCreatedAt(null);
        booking.setUpdatedAt(null);
        return bookingRepository.saveAndFlush(booking);
    }

    private GroupMember saveMember(GroupMember member) {
        member.setId(null);
        return groupMemberRepository.saveAndFlush(member);
    }
}

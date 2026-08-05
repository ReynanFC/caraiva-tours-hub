package com.caraivatours.hub.user;

import com.caraivatours.hub.AbstractIntegrationTest;
import com.caraivatours.hub.auth.PermissionRepository;
import com.caraivatours.hub.auth.entity.Permission;
import com.caraivatours.hub.auth.entity.enums.UserRole;
import com.caraivatours.hub.shared.dto.PagedResult;
import com.caraivatours.hub.shared.exceptions.EmailAlreadyExistsException;
import com.caraivatours.hub.shared.exceptions.ResourceNotFoundException;
import com.caraivatours.hub.user.dto.request.ToggleUserEnabledDTO;
import com.caraivatours.hub.user.dto.request.UserChangePasswordDTO;
import com.caraivatours.hub.user.dto.request.UserRegistrationDTO;
import com.caraivatours.hub.user.dto.request.UserUpdateDTO;
import com.caraivatours.hub.user.dto.response.UserHeaderDTO;
import com.caraivatours.hub.user.dto.response.UserProfileDTO;
import com.caraivatours.hub.user.dto.response.UserSummaryDTO;
import jakarta.persistence.EntityManager;
import jakarta.persistence.PersistenceContext;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Nested;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.dao.DataIntegrityViolationException;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Sort;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.transaction.annotation.Transactional;

import static com.caraivatours.hub.support.fixtures.PermissionTestDataBuilder.aPermission;
import static com.caraivatours.hub.support.fixtures.UserTestDataBuilder.aUser;
import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;

@SpringBootTest
@ActiveProfiles("test")
@Transactional
@DisplayName("User integration tests")
class UserTest extends AbstractIntegrationTest {

    private static final String CURRENT_PASSWORD = "CurrentPassword@123";
    private static final String NEW_PASSWORD = "NewPassword@456";

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private PermissionRepository permissionRepository;

    @Autowired
    private UserService userService;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @PersistenceContext
    private EntityManager entityManager;

    @Nested
    @DisplayName("UserRepository")
    class UserRepositoryTests {

        @Nested
        @DisplayName("Persistence")
        class PersistenceTests {

            @Test
            @DisplayName("should persist the user, generated fields and permission")
            void shouldPersistUserAndPermission() {
                User saved = saveUser(
                        "maria.silva",
                        "maria.silva@example.com",
                        CURRENT_PASSWORD,
                        true,
                        UserRole.EMPLOYEE
                );
                entityManager.clear();

                assertThat(userRepository.findById(saved.getId()))
                        .isPresent()
                        .get()
                        .satisfies(user -> {
                            assertThat(user.getExternalUserId()).isNotNull();
                            assertThat(user.getUsername()).isEqualTo("maria.silva");
                            assertThat(user.getFullName()).isEqualTo("Maria da Silva");
                            assertThat(user.getEmail()).isEqualTo("maria.silva@example.com");
                            assertThat(user.getPixKey()).isEqualTo("maria.silva@example.com");
                            assertThat(user.isEnabled()).isTrue();
                            assertThat(user.getCreatedAt()).isNotNull();
                            assertThat(user.getPermission())
                                    .singleElement()
                                    .extracting(Permission::getRole)
                                    .isEqualTo(UserRole.EMPLOYEE);
                        });
            }

            @Test
            @DisplayName("should reject duplicated email")
            void shouldRejectDuplicatedEmail() {
                saveUser(
                        "maria.silva",
                        "duplicated@example.com",
                        CURRENT_PASSWORD,
                        true,
                        UserRole.EMPLOYEE
                );

                assertThatThrownBy(() -> saveUser(
                        "joao.santos",
                        "duplicated@example.com",
                        CURRENT_PASSWORD,
                        true,
                        UserRole.ADMIN
                )).isInstanceOf(DataIntegrityViolationException.class);
            }
        }

        @Nested
        @DisplayName("findAll")
        class FindAllTests {

            @Test
            @DisplayName("should return all users paginated and sorted when search is empty")
            void shouldReturnAllUsersPaginatedAndSorted() {
                saveUser("zeca", "zeca@example.com", CURRENT_PASSWORD, true, UserRole.EMPLOYEE);
                saveUser("ana", "ana@example.com", CURRENT_PASSWORD, false, UserRole.ADMIN);
                saveUser("bruno", "bruno@example.com", CURRENT_PASSWORD, true, UserRole.EMPLOYEE);

                Page<UserSummaryDTO> result = userRepository.findAll(
                        "",
                        PageRequest.of(0, 2, Sort.by("userName").ascending())
                );

                assertThat(result.getContent())
                        .extracting(UserSummaryDTO::userName)
                        .containsExactly("ana", "bruno");
                assertThat(result.getTotalElements()).isEqualTo(3);
                assertThat(result.getTotalPages()).isEqualTo(2);
            }

            @Test
            @DisplayName("should search by username ignoring case")
            void shouldSearchByUsernameIgnoringCase() {
                saveUser("Maria.Silva", "maria@example.com", CURRENT_PASSWORD, true, UserRole.EMPLOYEE);
                saveUser("joao.santos", "joao@example.com", CURRENT_PASSWORD, true, UserRole.ADMIN);

                Page<UserSummaryDTO> result = userRepository.findAll(
                        "MARIA",
                        PageRequest.of(0, 10)
                );

                assertThat(result.getContent())
                        .singleElement()
                        .satisfies(user -> {
                            assertThat(user.userName()).isEqualTo("Maria.Silva");
                            assertThat(user.role()).isEqualTo(UserRole.EMPLOYEE);
                            assertThat(user.enabled()).isTrue();
                        });
            }

            @Test
            @DisplayName("should search by email ignoring case")
            void shouldSearchByEmailIgnoringCase() {
                saveUser("maria", "maria.vendas@example.com", CURRENT_PASSWORD, true, UserRole.EMPLOYEE);
                saveUser("joao", "joao@example.com", CURRENT_PASSWORD, true, UserRole.ADMIN);

                Page<UserSummaryDTO> result = userRepository.findAll(
                        "VENDAS@EXAMPLE",
                        PageRequest.of(0, 10)
                );

                assertThat(result.getContent())
                        .singleElement()
                        .extracting(UserSummaryDTO::email)
                        .isEqualTo("maria.vendas@example.com");
            }

            @Test
            @DisplayName("should return an empty page when no user matches")
            void shouldReturnEmptyPageWhenNoUserMatches() {
                saveUser("maria", "maria@example.com", CURRENT_PASSWORD, true, UserRole.EMPLOYEE);

                assertThat(userRepository.findAll("inexistente", PageRequest.of(0, 10)))
                        .isEmpty();
            }
        }

        @Nested
        @DisplayName("findHeaderDataById")
        class FindHeaderDataByIdTests {

            @Test
            @DisplayName("should return username and role")
            void shouldReturnUsernameAndRole() {
                User user = saveUser(
                        "maria.silva",
                        "maria@example.com",
                        CURRENT_PASSWORD,
                        true,
                        UserRole.ADMIN
                );

                assertThat(userRepository.findHeaderDataById(user.getId()))
                        .isPresent()
                        .get()
                        .satisfies(header -> {
                            assertThat(header.getName()).isEqualTo("maria.silva");
                            assertThat(header.getRole()).isEqualTo("ADMIN");
                        });
            }

            @Test
            @DisplayName("should return empty when user does not exist")
            void shouldReturnEmptyWhenUserDoesNotExist() {
                assertThat(userRepository.findHeaderDataById(Long.MAX_VALUE)).isEmpty();
            }
        }

        @Nested
        @DisplayName("findByEmail")
        class FindByEmailTests {

            @Test
            @DisplayName("should find the user by exact email")
            void shouldFindUserByExactEmail() {
                User expected = saveUser(
                        "maria",
                        "maria@example.com",
                        CURRENT_PASSWORD,
                        true,
                        UserRole.EMPLOYEE
                );

                assertThat(userRepository.findByEmail("maria@example.com")).contains(expected);
                assertThat(userRepository.findByEmail("MARIA@EXAMPLE.COM")).isEmpty();
            }

            @Test
            @DisplayName("should return empty when email does not exist")
            void shouldReturnEmptyWhenEmailDoesNotExist() {
                assertThat(userRepository.findByEmail("unknown@example.com")).isEmpty();
            }
        }

        @Nested
        @DisplayName("existsByEmail")
        class ExistsByEmailTests {

            @Test
            @DisplayName("should distinguish an occupied email from an available email")
            void shouldDistinguishOccupiedAndAvailableEmail() {
                saveUser("maria", "maria@example.com", CURRENT_PASSWORD, true, UserRole.EMPLOYEE);

                assertThat(userRepository.existsByEmail("maria@example.com")).isTrue();
                assertThat(userRepository.existsByEmail("available@example.com")).isFalse();
            }
        }

        @Nested
        @DisplayName("findEnabledStatusById")
        class FindEnabledStatusByIdTests {

            @Test
            @DisplayName("should return true for an enabled user")
            void shouldReturnTrueForEnabledUser() {
                User user = saveUser(
                        "enabled",
                        "enabled@example.com",
                        CURRENT_PASSWORD,
                        true,
                        UserRole.EMPLOYEE
                );

                assertThat(userRepository.findEnabledStatusById(user.getId())).contains(true);
            }

            @Test
            @DisplayName("should return false for a disabled user")
            void shouldReturnFalseForDisabledUser() {
                User user = saveUser(
                        "disabled",
                        "disabled@example.com",
                        CURRENT_PASSWORD,
                        false,
                        UserRole.EMPLOYEE
                );

                assertThat(userRepository.findEnabledStatusById(user.getId())).contains(false);
            }

            @Test
            @DisplayName("should return empty when user does not exist")
            void shouldReturnEmptyWhenUserDoesNotExist() {
                assertThat(userRepository.findEnabledStatusById(Long.MAX_VALUE)).isEmpty();
            }
        }
    }

    @Nested
    @DisplayName("UserService")
    class UserServiceTests {

        @Nested
        @DisplayName("loadUserByUsername")
        class LoadUserByUsernameTests {

            @Test
            @DisplayName("should load user details by email")
            void shouldLoadUserDetailsByEmail() {
                User user = saveUser(
                        "maria",
                        "maria@example.com",
                        CURRENT_PASSWORD,
                        true,
                        UserRole.ADMIN
                );

                assertThat(userService.loadUserByUsername(user.getEmail()))
                        .isSameAs(user)
                        .satisfies(details -> {
                            assertThat(details.getUsername()).isEqualTo("maria");
                            assertThat(details.getAuthorities())
                                    .extracting("authority")
                                    .containsExactly("ADMIN");
                        });
            }

            @Test
            @DisplayName("should throw when email does not exist")
            void shouldThrowWhenEmailDoesNotExist() {
                assertThatThrownBy(() -> userService.loadUserByUsername("unknown@example.com"))
                        .isInstanceOf(UsernameNotFoundException.class)
                        .hasMessage("User not found with email: unknown@example.com");
            }
        }

        @Nested
        @DisplayName("findById")
        class FindByIdTests {

            @Test
            @DisplayName("should return the existing user")
            void shouldReturnExistingUser() {
                User expected = saveUser(
                        "maria",
                        "maria@example.com",
                        CURRENT_PASSWORD,
                        true,
                        UserRole.EMPLOYEE
                );

                assertThat(userService.findById(expected.getId())).isSameAs(expected);
            }

            @Test
            @DisplayName("should throw when user does not exist")
            void shouldThrowWhenUserDoesNotExist() {
                assertThatThrownBy(() -> userService.findById(Long.MAX_VALUE))
                        .isInstanceOf(ResourceNotFoundException.class)
                        .hasMessage("User not found with ID: " + Long.MAX_VALUE);
            }
        }

        @Nested
        @DisplayName("findAll")
        class FindAllServiceTests {

            @Test
            @DisplayName("should map repository pagination and filtered content")
            void shouldMapPaginationAndFilteredContent() {
                saveUser("maria", "maria@example.com", CURRENT_PASSWORD, true, UserRole.EMPLOYEE);
                saveUser("mariana", "mariana@example.com", CURRENT_PASSWORD, false, UserRole.ADMIN);
                saveUser("joao", "joao@example.com", CURRENT_PASSWORD, true, UserRole.EMPLOYEE);

                PagedResult<UserSummaryDTO> result = userService.findAll(
                        "maria",
                        PageRequest.of(1, 1, Sort.by("userName").ascending())
                );

                assertThat(result.content())
                        .singleElement()
                        .extracting(UserSummaryDTO::userName)
                        .isEqualTo("mariana");
                assertThat(result.page()).isEqualTo(1);
                assertThat(result.size()).isEqualTo(1);
                assertThat(result.totalElements()).isEqualTo(2);
                assertThat(result.totalPages()).isEqualTo(2);
            }

            @Test
            @DisplayName("should treat null search as no filter")
            void shouldTreatNullSearchAsNoFilter() {
                saveUser("maria", "maria@example.com", CURRENT_PASSWORD, true, UserRole.EMPLOYEE);
                saveUser("joao", "joao@example.com", CURRENT_PASSWORD, true, UserRole.ADMIN);

                PagedResult<UserSummaryDTO> result = userService.findAll(
                        null,
                        PageRequest.of(0, 10)
                );

                assertThat(result.content()).hasSize(2);
                assertThat(result.totalElements()).isEqualTo(2);
            }
        }

        @Nested
        @DisplayName("findHeaderDataById")
        class FindHeaderDataByIdServiceTests {

            @Test
            @DisplayName("should return header data for existing user")
            void shouldReturnHeaderDataForExistingUser() {
                User user = saveUser(
                        "maria",
                        "maria@example.com",
                        CURRENT_PASSWORD,
                        true,
                        UserRole.EMPLOYEE
                );

                UserHeaderDTO result = userService.findHeaderDataById(user.getId());
                UserHeaderDTO cachedResult = userService.findHeaderDataById(user.getId());

                assertThat(result.name()).isEqualTo("maria");
                assertThat(result.role()).isEqualTo("EMPLOYEE");
                assertThat(cachedResult).isEqualTo(result);
            }

            @Test
            @DisplayName("should throw when user does not exist")
            void shouldThrowWhenUserDoesNotExist() {
                assertThatThrownBy(() -> userService.findHeaderDataById(Long.MAX_VALUE))
                        .isInstanceOf(ResourceNotFoundException.class)
                        .hasMessage("User not found with id: " + Long.MAX_VALUE);
            }
        }

        @Nested
        @DisplayName("findProfile")
        class FindProfileTests {

            @Test
            @DisplayName("should map the complete user profile")
            void shouldMapCompleteUserProfile() {
                User user = saveUser(
                        "maria",
                        "maria@example.com",
                        CURRENT_PASSWORD,
                        true,
                        UserRole.ADMIN
                );

                UserProfileDTO result = userService.findProfile(user.getId());

                assertThat(result.id()).isEqualTo(user.getId());
                assertThat(result.userName()).isEqualTo("maria");
                assertThat(result.fullName()).isEqualTo("Maria da Silva");
                assertThat(result.email()).isEqualTo("maria@example.com");
                assertThat(result.pixKey()).isEqualTo("maria@example.com");
                assertThat(result.role()).isEqualTo(UserRole.ADMIN);
                assertThat(result.createdAt()).isNotNull();
            }

            @Test
            @DisplayName("should throw when user does not exist")
            void shouldThrowWhenUserDoesNotExist() {
                assertThatThrownBy(() -> userService.findProfile(Long.MAX_VALUE))
                        .isInstanceOf(ResourceNotFoundException.class)
                        .hasMessage("User not found with id: " + Long.MAX_VALUE);
            }
        }

        @Nested
        @DisplayName("createUser")
        class CreateUserTests {

            @Test
            @DisplayName("should create enabled user with hashed password and case-insensitive role")
            void shouldCreateEnabledUserWithHashedPasswordAndPermission() {
                savePermission(UserRole.EMPLOYEE);
                UserRegistrationDTO request = registration(
                        "new.user",
                        "new.user@example.com",
                        CURRENT_PASSWORD,
                        "employee"
                );

                UserSummaryDTO result = userService.createUser(request);
                entityManager.flush();
                entityManager.clear();

                assertThat(result.userName()).isEqualTo("new.user");
                assertThat(result.email()).isEqualTo("new.user@example.com");
                assertThat(result.role()).isEqualTo(UserRole.EMPLOYEE);
                assertThat(result.enabled()).isTrue();

                assertThat(userRepository.findById(result.id()))
                        .isPresent()
                        .get()
                        .satisfies(user -> {
                            assertThat(user.getPassword()).isNotEqualTo(CURRENT_PASSWORD);
                            assertThat(passwordEncoder.matches(CURRENT_PASSWORD, user.getPassword())).isTrue();
                            assertThat(user.getPermission())
                                    .singleElement()
                                    .extracting(Permission::getRole)
                                    .isEqualTo(UserRole.EMPLOYEE);
                        });
            }

            @Test
            @DisplayName("should reject an email that already exists")
            void shouldRejectEmailThatAlreadyExists() {
                saveUser(
                        "existing",
                        "existing@example.com",
                        CURRENT_PASSWORD,
                        true,
                        UserRole.EMPLOYEE
                );
                UserRegistrationDTO request = registration(
                        "other",
                        "existing@example.com",
                        CURRENT_PASSWORD,
                        "ADMIN"
                );

                assertThatThrownBy(() -> userService.createUser(request))
                        .isInstanceOf(EmailAlreadyExistsException.class)
                        .hasMessage("The email existing@example.com already exists");
                assertThat(userRepository.count()).isEqualTo(1);
            }

            @Test
            @DisplayName("should reject registration when role permission is not configured")
            void shouldRejectRegistrationWhenPermissionIsMissing() {
                UserRegistrationDTO request = registration(
                        "new.user",
                        "new.user@example.com",
                        CURRENT_PASSWORD,
                        "ADMIN"
                );

                assertThatThrownBy(() -> userService.createUser(request))
                        .isInstanceOf(ResourceNotFoundException.class)
                        .hasMessage("Permission not found for role: ADMIN");
                assertThat(userRepository.count()).isZero();
            }
        }

        @Nested
        @DisplayName("updateUser")
        class UpdateUserTests {

            @Test
            @DisplayName("should update editable fields and preserve protected data")
            void shouldUpdateEditableFieldsAndPreserveProtectedData() {
                User user = saveUser(
                        "old.name",
                        "old@example.com",
                        CURRENT_PASSWORD,
                        false,
                        UserRole.ADMIN
                );
                String originalPassword = user.getPassword();
                String originalFullName = user.getFullName();
                UserUpdateDTO request = new UserUpdateDTO(
                        "new.name",
                        "new@example.com",
                        "11999999999"
                );

                UserSummaryDTO result = userService.updateUser(user.getId(), request);
                entityManager.flush();
                entityManager.clear();

                assertThat(result.userName()).isEqualTo("new.name");
                assertThat(result.email()).isEqualTo("new@example.com");
                assertThat(result.enabled()).isFalse();
                assertThat(result.role()).isEqualTo(UserRole.ADMIN);

                assertThat(userRepository.findById(user.getId()))
                        .isPresent()
                        .get()
                        .satisfies(updated -> {
                            assertThat(updated.getPixKey()).isEqualTo("11999999999");
                            assertThat(updated.getFullName()).isEqualTo(originalFullName);
                            assertThat(updated.getPassword()).isEqualTo(originalPassword);
                            assertThat(updated.isEnabled()).isFalse();
                            assertThat(updated.getPermission())
                                    .singleElement()
                                    .extracting(Permission::getRole)
                                    .isEqualTo(UserRole.ADMIN);
                        });
            }

            @Test
            @DisplayName("should ignore null fields in a partial update")
            void shouldIgnoreNullFieldsInPartialUpdate() {
                User user = saveUser(
                        "maria",
                        "maria@example.com",
                        CURRENT_PASSWORD,
                        true,
                        UserRole.EMPLOYEE
                );

                UserSummaryDTO result = userService.updateUser(
                        user.getId(),
                        new UserUpdateDTO(null, null, null)
                );

                assertThat(result.userName()).isEqualTo("maria");
                assertThat(result.email()).isEqualTo("maria@example.com");
                assertThat(user.getPixKey()).isEqualTo("maria@example.com");
            }

            @Test
            @DisplayName("should throw when user does not exist")
            void shouldThrowWhenUserDoesNotExist() {
                assertThatThrownBy(() -> userService.updateUser(
                        Long.MAX_VALUE,
                        new UserUpdateDTO("new.name", "new@example.com", null)
                ))
                        .isInstanceOf(ResourceNotFoundException.class)
                        .hasMessage("User not found with id: " + Long.MAX_VALUE);
            }
        }

        @Nested
        @DisplayName("changePassword")
        class ChangePasswordTests {

            @Test
            @DisplayName("should replace current password with a new hash")
            void shouldReplaceCurrentPasswordWithNewHash() {
                User user = saveUser(
                        "maria",
                        "maria@example.com",
                        CURRENT_PASSWORD,
                        true,
                        UserRole.EMPLOYEE
                );
                String previousHash = user.getPassword();

                UserSummaryDTO result = userService.changePassword(
                        user.getId(),
                        new UserChangePasswordDTO(CURRENT_PASSWORD, NEW_PASSWORD)
                );
                entityManager.flush();
                entityManager.clear();

                assertThat(result.id()).isEqualTo(user.getId());
                assertThat(userRepository.findById(user.getId()))
                        .isPresent()
                        .get()
                        .extracting(User::getPassword)
                        .satisfies(password -> {
                            assertThat(password).isNotEqualTo(previousHash);
                            assertThat(passwordEncoder.matches(NEW_PASSWORD, password)).isTrue();
                            assertThat(passwordEncoder.matches(CURRENT_PASSWORD, password)).isFalse();
                        });
            }

            @Test
            @DisplayName("should reject an incorrect current password without changing it")
            void shouldRejectIncorrectCurrentPassword() {
                User user = saveUser(
                        "maria",
                        "maria@example.com",
                        CURRENT_PASSWORD,
                        true,
                        UserRole.EMPLOYEE
                );
                String previousHash = user.getPassword();

                assertThatThrownBy(() -> userService.changePassword(
                        user.getId(),
                        new UserChangePasswordDTO("IncorrectPassword@123", NEW_PASSWORD)
                ))
                        .isInstanceOf(BadCredentialsException.class)
                        .hasMessage("Incorrect password");
                assertThat(user.getPassword()).isEqualTo(previousHash);
            }

            @Test
            @DisplayName("should throw when user does not exist")
            void shouldThrowWhenUserDoesNotExist() {
                assertThatThrownBy(() -> userService.changePassword(
                        Long.MAX_VALUE,
                        new UserChangePasswordDTO(CURRENT_PASSWORD, NEW_PASSWORD)
                ))
                        .isInstanceOf(ResourceNotFoundException.class)
                        .hasMessage("User not found with id: " + Long.MAX_VALUE);
            }
        }

        @Nested
        @DisplayName("changeEnabled")
        class ChangeEnabledTests {

            @Test
            @DisplayName("should disable an enabled user")
            void shouldDisableEnabledUser() {
                User user = saveUser(
                        "enabled",
                        "enabled@example.com",
                        CURRENT_PASSWORD,
                        true,
                        UserRole.EMPLOYEE
                );

                UserSummaryDTO result = userService.changeEnabled(
                        user.getId(),
                        new ToggleUserEnabledDTO(false)
                );

                assertThat(result.enabled()).isFalse();
                assertThat(userRepository.findEnabledStatusById(user.getId())).contains(false);
            }

            @Test
            @DisplayName("should enable a disabled user")
            void shouldEnableDisabledUser() {
                User user = saveUser(
                        "disabled",
                        "disabled@example.com",
                        CURRENT_PASSWORD,
                        false,
                        UserRole.EMPLOYEE
                );

                UserSummaryDTO result = userService.changeEnabled(
                        user.getId(),
                        new ToggleUserEnabledDTO(true)
                );

                assertThat(result.enabled()).isTrue();
                assertThat(userRepository.findEnabledStatusById(user.getId())).contains(true);
            }

            @Test
            @DisplayName("should throw when user does not exist")
            void shouldThrowWhenUserDoesNotExist() {
                assertThatThrownBy(() -> userService.changeEnabled(
                        Long.MAX_VALUE,
                        new ToggleUserEnabledDTO(false)
                ))
                        .isInstanceOf(ResourceNotFoundException.class)
                        .hasMessage("User not found with id: " + Long.MAX_VALUE);
            }
        }
    }

    private User saveUser(
            String userName,
            String email,
            String rawPassword,
            boolean enabled,
            UserRole role
    ) {
        Permission permission = savePermission(role);
        User user = aUser()
                .withEmail(email)
                .withPassword(passwordEncoder.encode(rawPassword))
                .enabled(enabled)
                .withPermission(permission)
                .build();
        user.setUserName(userName);
        user.setFullName("Maria da Silva");
        user.setPixKey(email);
        return userRepository.saveAndFlush(user);
    }

    private Permission savePermission(UserRole role) {
        return permissionRepository.saveAndFlush(aPermission()
                .withRole(role)
                .build());
    }

    private UserRegistrationDTO registration(
            String userName,
            String email,
            String password,
            String role
    ) {
        return new UserRegistrationDTO(
                userName,
                "New User Full Name",
                email,
                password,
                "new-user-pix-key",
                role
        );
    }
}

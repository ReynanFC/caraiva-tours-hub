package com.caraivatours.hub.auth;

import com.caraivatours.hub.AbstractIntegrationTest;
import com.caraivatours.hub.auth.dto.AccountCredentialsDTO;
import com.caraivatours.hub.auth.dto.AuthenticatedUser;
import com.caraivatours.hub.auth.dto.TokenDTO;
import com.caraivatours.hub.auth.entity.Permission;
import com.caraivatours.hub.auth.entity.enums.UserRole;
import com.caraivatours.hub.auth.jwt.JwtTokenProvider;
import com.caraivatours.hub.shared.exceptions.InvalidJwtAuthenticationException;
import com.caraivatours.hub.user.User;
import com.caraivatours.hub.user.UserRepository;
import jakarta.persistence.EntityManager;
import jakarta.persistence.PersistenceContext;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Nested;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.core.Authentication;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

import static com.caraivatours.hub.support.fixtures.PermissionTestDataBuilder.aPermission;
import static com.caraivatours.hub.support.fixtures.UserTestDataBuilder.aUser;
import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;

@SpringBootTest
@ActiveProfiles("test")
@Transactional
@DisplayName("Auth integration tests")
class AuthTest extends AbstractIntegrationTest {

    private static final String RAW_PASSWORD = "StrongPassword@123";

    @Autowired
    private PermissionRepository permissionRepository;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private AuthService authService;

    @Autowired
    private JwtTokenProvider jwtTokenProvider;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @PersistenceContext
    private EntityManager entityManager;

    @Nested
    @DisplayName("PermissionRepository")
    class PermissionRepositoryTests {

        @Nested
        @DisplayName("Persistence")
        class PersistenceTests {

            @Test
            @DisplayName("should save and find a permission by id")
            void shouldSaveAndFindPermissionById() {
                permissionRepository.delete(requirePermission(UserRole.ADMIN));
                permissionRepository.flush();
                Permission permission = permissionRepository.saveAndFlush(
                        aPermission().withRole(UserRole.ADMIN).build()
                );

                assertThat(permissionRepository.findById(permission.getId()))
                        .isPresent()
                        .get()
                        .satisfies(savedPermission -> {
                            assertThat(savedPermission.getRole()).isEqualTo(UserRole.ADMIN);
                            assertThat(savedPermission.getAuthority()).isEqualTo("ADMIN");
                        });
            }
        }

        @Nested
        @DisplayName("findByRole")
        class FindByRoleTests {

            @Test
            @DisplayName("should return the permission for an existing role")
            void shouldReturnPermissionForExistingRole() {
                Permission employeePermission = requirePermission(UserRole.EMPLOYEE);

                assertThat(permissionRepository.findByRole(UserRole.EMPLOYEE))
                        .isPresent()
                        .get()
                        .satisfies(permission -> {
                            assertThat(permission.getId()).isEqualTo(employeePermission.getId());
                            assertThat(permission.getRole()).isEqualTo(UserRole.EMPLOYEE);
                        });
            }

            @Test
            @DisplayName("should return empty when role is not persisted")
            void shouldReturnEmptyWhenRoleIsNotPersisted() {
                permissionRepository.delete(requirePermission(UserRole.EMPLOYEE));
                permissionRepository.flush();

                assertThat(permissionRepository.findByRole(UserRole.EMPLOYEE)).isEmpty();
            }
        }
    }

    @Nested
    @DisplayName("AuthService")
    class AuthServiceTests {

        @Nested
        @DisplayName("signIn")
        class SignInTests {

            @Test
            @DisplayName("should authenticate an enabled user and return valid tokens")
            void shouldAuthenticateEnabledUser() {
                User user = saveUser(
                        "admin@caraivatours.com",
                        RAW_PASSWORD,
                        true,
                        UserRole.ADMIN
                );

                ResponseEntity<TokenDTO> response = authService.signIn(
                        new AccountCredentialsDTO(user.getEmail(), RAW_PASSWORD)
                );

                assertThat(response.getStatusCode()).isEqualTo(HttpStatus.OK);
                assertThat(response.getBody()).isNotNull().satisfies(token -> {
                    assertThat(token.authenticated()).isTrue();
                    assertThat(token.created()).isBefore(token.expiration());
                    assertThat(token.accessToken()).isNotBlank();
                    assertThat(token.refreshToken()).isNotBlank();
                    assertTokenIdentity(token.accessToken(), user, UserRole.ADMIN);
                });
            }

            @Test
            @DisplayName("should use EMPLOYEE role when user has no permission")
            void shouldUseEmployeeRoleWhenUserHasNoPermission() {
                User user = saveUserWithoutPermission(
                        "employee@caraivatours.com",
                        RAW_PASSWORD,
                        true
                );

                TokenDTO token = authService.signIn(
                        new AccountCredentialsDTO(user.getEmail(), RAW_PASSWORD)
                ).getBody();

                assertThat(token).isNotNull();
                assertTokenIdentity(token.accessToken(), user, UserRole.EMPLOYEE);
            }

            @Test
            @DisplayName("should reject an incorrect password")
            void shouldRejectIncorrectPassword() {
                User user = saveUser(
                        "employee@caraivatours.com",
                        RAW_PASSWORD,
                        true,
                        UserRole.EMPLOYEE
                );

                assertThatThrownBy(() -> authService.signIn(
                        new AccountCredentialsDTO(user.getEmail(), "IncorrectPassword")
                ))
                        .isInstanceOf(BadCredentialsException.class)
                        .hasMessage("Invalid username or password");
            }

            @Test
            @DisplayName("should reject an unknown email")
            void shouldRejectUnknownEmail() {
                assertThatThrownBy(() -> authService.signIn(
                        new AccountCredentialsDTO("unknown@caraivatours.com", RAW_PASSWORD)
                ))
                        .isInstanceOf(BadCredentialsException.class)
                        .hasMessage("Invalid username or password");
            }

            @Test
            @DisplayName("should reject a disabled user")
            void shouldRejectDisabledUser() {
                User user = saveUser(
                        "disabled@caraivatours.com",
                        RAW_PASSWORD,
                        false,
                        UserRole.EMPLOYEE
                );

                assertThatThrownBy(() -> authService.signIn(
                        new AccountCredentialsDTO(user.getEmail(), RAW_PASSWORD)
                ))
                        .isInstanceOf(BadCredentialsException.class)
                        .hasMessage("Invalid username or password");
            }
        }

        @Nested
        @DisplayName("refreshToken")
        class RefreshTokenTests {

            @Test
            @DisplayName("should consume a valid refresh token and issue a new token pair")
            void shouldRefreshValidToken() {
                User user = saveUser(
                        "employee@caraivatours.com",
                        RAW_PASSWORD,
                        true,
                        UserRole.EMPLOYEE
                );
                TokenDTO originalToken = signIn(user);

                ResponseEntity<TokenDTO> response =
                        authService.refreshToken(originalToken.refreshToken());

                assertThat(response.getStatusCode()).isEqualTo(HttpStatus.OK);
                assertThat(response.getBody()).isNotNull().satisfies(refreshedToken -> {
                    assertThat(refreshedToken.authenticated()).isTrue();
                    assertThat(refreshedToken.refreshToken())
                            .isNotEqualTo(originalToken.refreshToken());
                    assertTokenIdentity(
                            refreshedToken.accessToken(),
                            user,
                            UserRole.EMPLOYEE
                    );
                });
            }

            @Test
            @DisplayName("should reject a missing refresh token")
            void shouldRejectMissingRefreshToken() {
                assertThatThrownBy(() -> authService.refreshToken(""))
                        .isInstanceOf(InvalidJwtAuthenticationException.class)
                        .hasMessage("Refresh token is missing");
            }

            @Test
            @DisplayName("should reject an invalid refresh token")
            void shouldRejectInvalidRefreshToken() {
                assertThatThrownBy(() -> authService.refreshToken("invalid-token"))
                        .isInstanceOf(InvalidJwtAuthenticationException.class)
                        .hasMessage("Invalid or expired JWT token");
            }

            @Test
            @DisplayName("should reject reuse of an already consumed refresh token")
            void shouldRejectRefreshTokenReuse() {
                User user = saveUser(
                        "employee@caraivatours.com",
                        RAW_PASSWORD,
                        true,
                        UserRole.EMPLOYEE
                );
                TokenDTO originalToken = signIn(user);
                authService.refreshToken(originalToken.refreshToken());

                assertThatThrownBy(() ->
                        authService.refreshToken(originalToken.refreshToken()))
                        .isInstanceOf(InvalidJwtAuthenticationException.class)
                        .hasMessage("Refresh token already used");
            }

            @Test
            @DisplayName("should reject refresh token when user has been disabled")
            void shouldRejectRefreshTokenForDisabledUser() {
                User user = saveUser(
                        "employee@caraivatours.com",
                        RAW_PASSWORD,
                        true,
                        UserRole.EMPLOYEE
                );
                TokenDTO token = signIn(user);
                user.setEnabled(false);
                userRepository.flush();

                assertThatThrownBy(() -> authService.refreshToken(token.refreshToken()))
                        .isInstanceOf(InvalidJwtAuthenticationException.class)
                        .hasMessage("User account is disabled or inactive");
            }

            @Test
            @DisplayName("should reject a refresh token used as an access token")
            void shouldRejectRefreshTokenAsAccessToken() {
                User user = saveUser(
                        "employee@caraivatours.com",
                        RAW_PASSWORD,
                        true,
                        UserRole.EMPLOYEE
                );
                TokenDTO token = signIn(user);

                assertThatThrownBy(() ->
                        jwtTokenProvider.getAuthenticationFromToken(token.refreshToken()))
                        .isInstanceOf(InvalidJwtAuthenticationException.class)
                        .hasMessage("Provided token is not a valid access token");
            }
        }
    }

    private Permission requirePermission(UserRole role) {
        return permissionRepository.findByRole(role)
                .orElseThrow(() -> new AssertionError("Seeded permission not found: " + role));
    }

    private User saveUser(
            String email,
            String rawPassword,
            boolean enabled,
            UserRole role
    ) {
        Permission permission = requirePermission(role);
        return saveUser(
                aUser()
                        .withEmail(email)
                        .withPassword(passwordEncoder.encode(rawPassword))
                        .enabled(enabled)
                        .withPermission(permission)
                        .build()
        );
    }

    private User saveUserWithoutPermission(
            String email,
            String rawPassword,
            boolean enabled
    ) {
        return saveUser(
                aUser()
                        .withEmail(email)
                        .withPassword(passwordEncoder.encode(rawPassword))
                        .enabled(enabled)
                        .withPermissions(List.of())
                        .build()
        );
    }

    private User saveUser(User user) {
        User savedUser = userRepository.saveAndFlush(user);
        Long userId = savedUser.getId();
        entityManager.clear();
        return userRepository.findById(userId).orElseThrow();
    }

    private TokenDTO signIn(User user) {
        return authService.signIn(
                new AccountCredentialsDTO(user.getEmail(), RAW_PASSWORD)
        ).getBody();
    }

    private void assertTokenIdentity(
            String accessToken,
            User user,
            UserRole expectedRole
    ) {
        Authentication authentication =
                jwtTokenProvider.getAuthenticationFromToken(accessToken);
        AuthenticatedUser principal = (AuthenticatedUser) authentication.getPrincipal();

        assertThat(principal.id()).isEqualTo(user.getId());
        assertThat(principal.uuid()).isEqualTo(user.getExternalUserId());
        assertThat(authentication.getAuthorities())
                .extracting("authority")
                .containsExactly(expectedRole.name());
    }
}

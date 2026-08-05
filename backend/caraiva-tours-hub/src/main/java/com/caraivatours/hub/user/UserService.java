package com.caraivatours.hub.user;

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
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.cache.annotation.CacheEvict;
import org.springframework.cache.annotation.Cacheable;
import org.springframework.cache.annotation.Caching;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@Transactional
@Slf4j
@RequiredArgsConstructor
public class UserService implements UserDetailsService {

    private final UserRepository userRepository;
    private final PermissionRepository permissionRepository;
    private final UserMapper mapper;
    private final PasswordEncoder passwordEncoder;

    @Override
    @Transactional(readOnly = true)
    public UserDetails loadUserByUsername(String email) {
        log.info("Loading user by username (email): '{}'", email);

        return userRepository.findByEmail(email)
                .orElseThrow(() -> {
                    log.debug("Load failed: User with email '{}' not found", email);
                    return new UsernameNotFoundException("User not found with email: " + email);
                });
    }

    @Transactional(readOnly = true)
    public User findById(Long id) {
        return userRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("User not found with ID: " + id));
    }

    @Transactional(readOnly = true)
    @Cacheable(
            value = "users",
            key = "#search + '-' + #pageable.pageNumber + '-' + #pageable.pageSize + '-' + #pageable.sort",
            condition = "#search == null || #search.isEmpty()"
    )
    public PagedResult<UserSummaryDTO> findAll(String search, Pageable pageable) {
        log.info("Fetching paginated users list");
        log.debug("Pagination details: {}", pageable);

        Page<UserSummaryDTO> userSummary = userRepository.findAll(search, pageable);

        log.debug("Database returned {} users for the current page", userSummary);

        return PagedResult.from(userSummary);
    }

    @Transactional(readOnly = true)
    @Cacheable(value = "userHeader", key = "#id")
    public UserHeaderDTO findHeaderDataById(Long id) {
        log.info("Fetching user header data for ID: {}", id);

        var projection = userRepository.findHeaderDataById(id)
                .orElseThrow(() -> {
                    log.debug("Fetch failed: User header data for ID {} not found", id);
                    return new ResourceNotFoundException("User not found with id: " + id);
                });

        return new UserHeaderDTO(projection.getName(), projection.getRole());
    }

    @Cacheable(value = "userProfile", key = "#id")
    @Transactional(readOnly = true)
    public UserProfileDTO findProfile(Long id) {
        log.info("Fetching user profile for ID: {}", id);

        User entity = userRepository.findById(id)
                .orElseThrow(() -> {
                    log.debug("Fetch failed: User profile for ID {} not found", id);
                    return new ResourceNotFoundException("User not found with id: " + id);
                });

        return mapper.toProfileDTO(entity);
    }

    @CacheEvict(value = "users", allEntries = true)
    public UserSummaryDTO createUser(UserRegistrationDTO dto) {
        log.info("Attempting to register a new user with email: '{}'", dto.email());

        if (userRepository.existsByEmail(dto.email())) {
            throw new EmailAlreadyExistsException("The email " + dto.email() + " already exists");
        }

        log.debug("Mapping UserRegistrationDTO to User entity state");
        User entity = mapper.toEntity(dto);
        entity.setEnabled(true);

        log.debug("Hashing user password before persisting");
        entity.setPassword(generateHashedPassword(dto.password()));

        insertUserPermissions(entity, dto.role().toUpperCase());

        entity = userRepository.save(entity);
        log.info("User registered successfully with ID: '{}' and email: '{}'", entity.getId(), entity.getEmail());

        return mapper.toDTO(entity);
    }

    private void insertUserPermissions(User entity, String role) {
        log.debug("Inserting user permissions for entity with role: '{}'", role);
        Permission dbPermission = permissionRepository.findByRole(UserRole.valueOf(role))
                .orElseThrow(() -> new ResourceNotFoundException("Permission not found for role: " + role));

        entity.addPermission(dbPermission);
    }

    @Caching(evict = {
            @CacheEvict(value = "users", allEntries = true),
            @CacheEvict(value = {"userHeader", "userProfile"},  key = "#id"),
    })
    public UserSummaryDTO updateUser(Long id, UserUpdateDTO userUpdateDTO) {
        log.info("Attempting to update user with ID: {}", id);
        log.debug("Payload data received for update: {}", userUpdateDTO);

        User entity = userRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("User not found with id: " + id));

        log.debug("Current entity state before update - ID: {}, Email: '{}', Enabled: {}",
                entity.getId(), entity.getEmail(), entity.isEnabled());

        log.debug("Merging UserUpdateDTO fields into existing User entity");
        mapper.updateEntityFromDto(userUpdateDTO, entity);

        entity = userRepository.save(entity);
        log.info("User with ID: {} updated successfully", entity.getId());

        return mapper.toDTO(entity);
    }

    public UserSummaryDTO changePassword(Long id, UserChangePasswordDTO dto) {
        log.info("Attempting to change password for user with ID: {}", id);

        User entity = userRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("User not found with id: " + id));

        log.debug("Verifying current password validity for user ID: {}", id);
        if (!verifyPassword(dto.currentPassword(), entity.getPassword())) {
            log.debug("Password change blocked: Current password verification failed for user ID: {}", id);
            throw new BadCredentialsException("Incorrect password");
        }

        log.debug("Hashing and setting new password for user ID: {}", id);
        entity.setPassword(generateHashedPassword(dto.newPassword()));

        entity = userRepository.save(entity);
        log.info("Password for user with ID: {} changed successfully", entity.getId());

        return mapper.toDTO(entity);
    }

    @Caching( evict = {
            @CacheEvict(value = "users", allEntries = true),
            @CacheEvict(value = {"userHeader", "userProfile"}, key = "#id")
    })
    public UserSummaryDTO changeEnabled(Long id, ToggleUserEnabledDTO userEnabledDTO) {
        log.info("Attempting to update status (enabled) for user with ID: {}", id);
        log.debug("Payload data received for status change: {}", userEnabledDTO);

        User entity = userRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("User not found with id: " + id));

        log.debug("Current entity state before status update - ID: {}, Email: '{}', Current Status: {}",
                entity.getId(), entity.getEmail(), entity.isEnabled());

        entity.setEnabled(userEnabledDTO.enabled());
        log.debug("Entity state updated in memory - New Status (Enabled): {}", entity.isEnabled());

        entity = userRepository.save(entity);
        log.info("User with ID: {} status updated successfully to: {}", entity.getId(), entity.isEnabled());

        return mapper.toDTO(entity);
    }

    private boolean verifyPassword(String rawPassword, String encodedPassword) {
        return passwordEncoder.matches(rawPassword, encodedPassword);
    }

    private String generateHashedPassword(String password) {
        return passwordEncoder.encode(password);
    }
}

package com.caraivatours.hub.user;

import com.caraivatours.hub.shared.exceptions.EmailAlreadyExistsException;
import com.caraivatours.hub.user.dto.request.UserRegistrationDTO;
import com.caraivatours.hub.user.dto.response.UserSummaryDTO;
import jakarta.transaction.Transactional;
import lombok.AllArgsConstructor;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

@Service
@AllArgsConstructor
public class UserService implements UserDetailsService {
    private static final Logger logger = LoggerFactory.getLogger(UserService.class);

    private final UserRepository userRepository;
    private final UserMapper mapper;
    private final PasswordEncoder passwordEncoder;

    @Override
    public UserDetails loadUserByUsername(String email) {
        logger.info("Loading user by username: {}", email);

        return userRepository.findByEmail(email)
                .orElseThrow(() ->  new UsernameNotFoundException("User not found with email: " + email));
    }

    @Transactional
    public UserSummaryDTO create(UserRegistrationDTO dto) {
        logger.info("Creating user with email: {}", dto.email());

        if (userRepository.existsByEmail(dto.email())) {
             throw new EmailAlreadyExistsException("The email " + dto.email() + " already exists");
        }

        User entity = mapper.toEntity(dto);
        entity.setEnabled(true);
        entity.setPassword(generateHashedPassword(dto.password()));

        User savedUser = userRepository.save(entity);
        logger.info("Created user with email: {}", savedUser.getEmail());
        return mapper.toDTO(savedUser);
    }



    private String generateHashedPassword(String password) {
        return passwordEncoder.encode(password);
    }
}

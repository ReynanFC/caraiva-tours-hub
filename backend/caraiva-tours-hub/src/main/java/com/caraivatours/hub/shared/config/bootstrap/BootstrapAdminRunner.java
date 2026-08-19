package com.caraivatours.hub.shared.config.bootstrap;

import com.caraivatours.hub.auth.entity.enums.UserRole;
import com.caraivatours.hub.user.UserRepository;
import com.caraivatours.hub.user.UserService;
import com.caraivatours.hub.user.dto.request.UserRegistrationDTO;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.boot.ApplicationArguments;
import org.springframework.boot.ApplicationRunner;
import org.springframework.boot.context.properties.EnableConfigurationProperties;
import org.springframework.stereotype.Component;

@Slf4j
@Component
@RequiredArgsConstructor
@EnableConfigurationProperties(BootstrapAdminProperties.class)
public class BootstrapAdminRunner implements ApplicationRunner {

    private final UserRepository userRepository;
    private final UserService userService;
    private final BootstrapAdminProperties properties;

    @Override
    public void run(ApplicationArguments args) throws Exception {
        if (!properties.enabled()) {
            log.info("Administrator bootstrap is disabled.");
            return;
        }

        if (userRepository.existsByPermissionRole(UserRole.ADMIN)) {
            log.info("Administrator already exists; bootstrap ignored.");
            return;
        }

        UserRegistrationDTO request = new UserRegistrationDTO(
                properties.userName(),
                properties.fullName(),
                properties.email(),
                null,
                UserRole.ADMIN.name()
        );

        userService.createUser(request);

        log.info("Initial administrator created. The password setup link has been sent to {}",
                properties.email()
        );
    }
}

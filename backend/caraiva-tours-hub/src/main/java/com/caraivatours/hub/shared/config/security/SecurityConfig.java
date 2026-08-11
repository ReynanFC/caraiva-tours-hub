package com.caraivatours.hub.shared.config.security;

import com.caraivatours.hub.auth.jwt.JwtTokenFilter;
import com.caraivatours.hub.auth.jwt.JwtTokenProvider;
import com.caraivatours.hub.ratelimit.RateLimitFilter;
import lombok.RequiredArgsConstructor;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.config.annotation.authentication.configuration.AuthenticationConfiguration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.annotation.method.configuration.EnableMethodSecurity;
import org.springframework.security.config.annotation.web.configurers.AbstractHttpConfigurer;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.crypto.argon2.Argon2PasswordEncoder;
import org.springframework.security.crypto.password.DelegatingPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;

import java.util.HashMap;
import java.util.Map;

@EnableWebSecurity
@EnableMethodSecurity
@Configuration
@RequiredArgsConstructor
public class SecurityConfig {

    private final JwtTokenProvider tokenProvider;
    private final RateLimitFilter rateLimitFilter;

    @Bean
    PasswordEncoder passwordEncoder() {
        PasswordEncoder argon2 = new Argon2PasswordEncoder(16, 32, 1, 65536, 3);

        Map<String, PasswordEncoder> encoders = new HashMap<>();
        encoders.put("argon2", argon2);

        DelegatingPasswordEncoder passwordEncoder = new DelegatingPasswordEncoder("argon2", encoders);
        passwordEncoder.setDefaultPasswordEncoderForMatches(argon2);

        return passwordEncoder;
    }

    @Bean
    AuthenticationManager authenticationManager(AuthenticationConfiguration configuration) {
        return configuration.getAuthenticationManager();
    }

    @Bean
    SecurityFilterChain securityFilterChain(HttpSecurity http)  {
        return http
                .httpBasic(AbstractHttpConfigurer :: disable)
                .csrf(AbstractHttpConfigurer :: disable)
                .addFilterBefore(new JwtTokenFilter(tokenProvider), UsernamePasswordAuthenticationFilter.class)
                .addFilterBefore(rateLimitFilter, JwtTokenFilter.class)
                .sessionManagement(
                        session -> session
                                .sessionCreationPolicy(SessionCreationPolicy.STATELESS)
                )
                .authorizeHttpRequests(
                        authorizeHttpRequest -> authorizeHttpRequest
                                .requestMatchers(
                                        "/auth/signin",
                                        "/auth/refresh/**",
                                        "/auth/forgot-password",
                                        "/auth/reset-password",
                                        "/swagger-ui/**",
                                        "/v3/api-docs/**"
                                ).permitAll()
                                .requestMatchers("/api/**").authenticated()
                                .requestMatchers("/users").denyAll()
                )
                .cors(cors -> {})
                .build();
    }
}

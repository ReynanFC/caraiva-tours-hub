package com.caraivatours.hub.shared.config.web;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.servlet.config.annotation.CorsRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

@Configuration
public class CorsConfig implements WebMvcConfigurer {

    @Value("${cors.originPatterns:http://localhost:4200}")
    private String corsAllowedOriginPatterns;

    @Override
    public void addCorsMappings(CorsRegistry registry) {
        String[] allowedOrigins = corsAllowedOriginPatterns.split("\\s*,\\s*");

        registry.addMapping("/**")
                .allowedOriginPatterns(allowedOrigins)
                .allowedMethods("GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS")
                .allowedHeaders("Authorization", "Content-Type", "Accept", "Origin")
                .exposedHeaders("Authorization")
                .allowCredentials(true)
                .maxAge(3600);
    }
}

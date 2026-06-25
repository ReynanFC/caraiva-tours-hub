package com.caraivatours.hub.shared.config.swagger;

import io.swagger.v3.oas.models.Components;
import io.swagger.v3.oas.models.OpenAPI;
import io.swagger.v3.oas.models.info.Info;
import io.swagger.v3.oas.models.security.SecurityRequirement;
import io.swagger.v3.oas.models.security.SecurityScheme;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
public class OpenApiConfig {

    @Bean
    public OpenAPI customOpenAPI() {
        final String cookieSchemeName = "cookieAuth";

        return new OpenAPI()
                .info(new Info().title("Project Tour Caraiva - API").version("v1"))
                // Adiciona o suporte a Cookie
                .addSecurityItem(new SecurityRequirement().addList(cookieSchemeName))
                .components(new Components()
                        .addSecuritySchemes(cookieSchemeName,
                                new SecurityScheme()
                                        .name("refreshToken")
                                        .type(SecurityScheme.Type.APIKEY)
                                        .in(SecurityScheme.In.COOKIE)));
    }
}
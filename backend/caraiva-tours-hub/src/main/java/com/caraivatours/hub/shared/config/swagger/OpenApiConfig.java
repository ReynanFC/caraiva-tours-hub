package com.caraivatours.hub.shared.config.swagger;

import io.swagger.v3.oas.models.Components;
import io.swagger.v3.oas.models.OpenAPI;
import io.swagger.v3.oas.models.info.Info;
import io.swagger.v3.oas.models.security.SecurityRequirement;
import io.swagger.v3.oas.models.security.SecurityScheme;
import org.springdoc.core.customizers.OpenApiCustomizer;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
public class OpenApiConfig {

    private static final String BEARER_SCHEME_NAME = "bearerAuth";
    private static final String COOKIE_SCHEME_NAME = "cookieAuth";

    @Bean
    public OpenAPI customOpenAPI() {
        return new OpenAPI()
                .info(new Info().title("Project Tour Caraiva - API").version("v1"))
                .components(new Components()
                        .addSecuritySchemes(BEARER_SCHEME_NAME,
                                new SecurityScheme()
                                        .type(SecurityScheme.Type.HTTP)
                                        .scheme("bearer")
                                        .bearerFormat("JWT"))
                        .addSecuritySchemes(COOKIE_SCHEME_NAME,
                                new SecurityScheme()
                                        .name("refreshToken")
                                        .type(SecurityScheme.Type.APIKEY)
                                        .in(SecurityScheme.In.COOKIE)));
    }

    @Bean
    public OpenApiCustomizer protectedEndpointsSecurityCustomizer() {
        return openApi -> {
            if (openApi.getPaths() == null) {
                return;
            }

            openApi.getPaths().forEach((path, pathItem) -> {
                if (path.startsWith("/api/")) {
                    pathItem.readOperations().forEach(operation ->
                            operation.addSecurityItem(
                                    new SecurityRequirement().addList(BEARER_SCHEME_NAME)
                            )
                    );
                }
            });
        };
    }
}

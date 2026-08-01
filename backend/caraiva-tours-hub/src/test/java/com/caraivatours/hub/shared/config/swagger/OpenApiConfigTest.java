package com.caraivatours.hub.shared.config.swagger;

import io.swagger.v3.oas.models.OpenAPI;
import io.swagger.v3.oas.models.Operation;
import io.swagger.v3.oas.models.PathItem;
import io.swagger.v3.oas.models.Paths;
import io.swagger.v3.oas.models.security.SecurityScheme;
import org.junit.jupiter.api.Test;

import static org.assertj.core.api.Assertions.assertThat;

class OpenApiConfigTest {

    private final OpenApiConfig config = new OpenApiConfig();

    @Test
    void shouldConfigureBearerAndCookieSecuritySchemes() {
        OpenAPI openAPI = config.customOpenAPI();

        assertThat(openAPI.getComponents().getSecuritySchemes())
                .containsKeys("bearerAuth", "cookieAuth");
        assertThat(openAPI.getComponents().getSecuritySchemes().get("bearerAuth"))
                .satisfies(scheme -> {
                    assertThat(scheme.getType()).isEqualTo(SecurityScheme.Type.HTTP);
                    assertThat(scheme.getScheme()).isEqualTo("bearer");
                    assertThat(scheme.getBearerFormat()).isEqualTo("JWT");
                });
    }

    @Test
    void shouldRequireBearerAuthenticationOnlyForApiEndpoints() {
        Operation protectedOperation = new Operation();
        Operation publicOperation = new Operation();
        OpenAPI openAPI = config.customOpenAPI().paths(new Paths()
                .addPathItem("/api/bookings", new PathItem().get(protectedOperation))
                .addPathItem("/auth/signin", new PathItem().post(publicOperation)));

        config.protectedEndpointsSecurityCustomizer().customise(openAPI);

        assertThat(protectedOperation.getSecurity())
                .singleElement()
                .satisfies(requirement -> assertThat(requirement).containsKey("bearerAuth"));
        assertThat(publicOperation.getSecurity()).isNull();
    }
}

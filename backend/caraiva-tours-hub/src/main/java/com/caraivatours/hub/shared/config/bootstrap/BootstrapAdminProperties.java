package com.caraivatours.hub.shared.config.bootstrap;

import org.springframework.boot.context.properties.ConfigurationProperties;

@ConfigurationProperties(prefix = "app.bootstrap-admin")
public record BootstrapAdminProperties(
   boolean enabled,
   String userName,
   String fullName,
   String email
) {}

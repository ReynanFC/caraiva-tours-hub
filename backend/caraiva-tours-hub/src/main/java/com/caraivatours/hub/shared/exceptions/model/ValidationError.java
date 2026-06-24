package com.caraivatours.hub.shared.exceptions.model;

import java.time.Instant;
import java.util.Map;
import java.util.UUID;

public record ValidationError(
        Instant timestamp,
        Map<String, String> errors,
        String path,
        UUID traceId
) {}

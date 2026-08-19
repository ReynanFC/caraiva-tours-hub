package com.caraivatours.hub.dashboard.sse;

import org.springframework.context.annotation.Configuration;
import org.springframework.scheduling.annotation.EnableScheduling;

/** Enables the scheduler responsible for dashboard SSE heartbeat delivery. */
@Configuration
@EnableScheduling
public class DashboardSseConfig {
}

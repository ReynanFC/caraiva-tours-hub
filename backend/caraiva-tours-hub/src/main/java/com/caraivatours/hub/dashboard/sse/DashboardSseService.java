package com.caraivatours.hub.dashboard.sse;

import com.caraivatours.hub.auth.entity.enums.UserRole;
import com.caraivatours.hub.dashboard.dto.response.DashboardChangedDTO;
import lombok.extern.slf4j.Slf4j;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;
import org.springframework.web.context.request.async.AsyncRequestNotUsableException;
import org.springframework.web.servlet.mvc.method.annotation.SseEmitter;

import java.io.IOException;
import java.time.Duration;
import java.time.Instant;
import java.util.Map;
import java.util.Set;
import java.util.concurrent.ConcurrentHashMap;

@Slf4j
@Service
public class DashboardSseService {

    private static final Duration MAX_CONNECTION_DURATION = Duration.ofMinutes(30);

    private final Map<UserRole, Map<Long, Set<SseEmitter>>> emittersByRole = Map.of(
            UserRole.EMPLOYEE, new ConcurrentHashMap<>(),
            UserRole.ADMIN, new ConcurrentHashMap<>()
    );

    public SseEmitter subscribe(Long userId, UserRole role, Instant tokenExpiresAt) {
        SseEmitter emitter = new SseEmitter(resolveTimeout(tokenExpiresAt));
        connections(role).computeIfAbsent(userId, ignored -> ConcurrentHashMap.newKeySet()).add(emitter);

        emitter.onCompletion(() -> remove(role, userId, emitter));
        emitter.onTimeout(() -> remove(role, userId, emitter));
        emitter.onError(error -> remove(role, userId, emitter));

        try {
            emitter.send(SseEmitter.event()
                    .name("connected")
                    .data(Map.of("connectedAt", Instant.now(), "role", role)));
        } catch (AsyncRequestNotUsableException exception) {
            remove(role, userId, emitter);
        } catch (IOException exception) {
            remove(role, userId, emitter);
            emitter.completeWithError(exception);
        }

        log.debug("Dashboard SSE connection registered for user ID {} with role {}", userId, role);
        return emitter;
    }

    public void sendToRole(UserRole role, DashboardChangedDTO notification) {
        connections(role).forEach((userId, emitters) ->
                emitters.forEach(emitter -> send(role, userId, emitter, notification)));
    }

    @Scheduled(fixedDelayString = "${app.dashboard.sse.heartbeat-interval:60000}")
    public void sendHeartbeat() {
        emittersByRole.forEach((role, users) ->
                users.forEach((userId, emitters) ->
                        emitters.forEach(emitter -> sendHeartbeat(role, userId, emitter))));
    }

    private void send(UserRole role, Long userId, SseEmitter emitter, DashboardChangedDTO notification) {
        try {
            emitter.send(SseEmitter.event()
                    .id(notification.occurredAt().toString())
                    .name("dashboard-changed")
                    .data(notification));
        } catch (AsyncRequestNotUsableException exception) {
            log.debug("Dashboard SSE connection already closed for user ID {}", userId);
            remove(role, userId, emitter);
        } catch (IOException | IllegalStateException exception) {
            log.debug("Removing unavailable dashboard SSE connection for user ID {}", userId);
            remove(role, userId, emitter);
            emitter.complete();
        }
    }

    private void sendHeartbeat(UserRole role, Long userId, SseEmitter emitter) {
        try {
            emitter.send(SseEmitter.event()
                    .name("heartbeat")
                    .data(Map.of("sentAt", Instant.now())));
        } catch (AsyncRequestNotUsableException exception) {
            log.debug("Dashboard SSE connection already closed for user ID {}", userId);
            remove(role, userId, emitter);
        } catch (IOException | IllegalStateException exception) {
            log.debug("Heartbeat failed; removing dashboard SSE connection for user ID {}", userId);
            remove(role, userId, emitter);
            emitter.complete();
        }
    }

    private Map<Long, Set<SseEmitter>> connections(UserRole role) {
        return emittersByRole.get(role);
    }

    private long resolveTimeout(Instant tokenExpiresAt) {
        Duration tokenRemainingTime = Duration.between(Instant.now(), tokenExpiresAt);
        return Math.max(1, Math.min(MAX_CONNECTION_DURATION.toMillis(), tokenRemainingTime.toMillis()));
    }

    private void remove(UserRole role, Long userId, SseEmitter emitter) {
        connections(role).computeIfPresent(userId, (ignored, emitters) -> {
            emitters.remove(emitter);
            return emitters.isEmpty() ? null : emitters;
        });
    }
}

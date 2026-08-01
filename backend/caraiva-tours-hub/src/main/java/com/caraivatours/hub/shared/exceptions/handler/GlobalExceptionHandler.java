package com.caraivatours.hub.shared.exceptions.handler;

import com.caraivatours.hub.shared.exceptions.EmailAlreadyExistsException;
import com.caraivatours.hub.shared.exceptions.EntityInUseException;
import com.caraivatours.hub.shared.exceptions.InvalidJwtAuthenticationException;
import com.caraivatours.hub.shared.exceptions.JasperPdfExportException;
import com.caraivatours.hub.shared.exceptions.JasperReportGenerationException;
import com.caraivatours.hub.shared.exceptions.ResourceNotFoundException;
import com.caraivatours.hub.shared.exceptions.model.StandardError;
import com.caraivatours.hub.shared.exceptions.model.ValidationError;
import jakarta.servlet.http.HttpServletRequest;
import lombok.extern.slf4j.Slf4j;
import org.apache.coyote.BadRequestException;
import org.springframework.core.annotation.AnnotatedElementUtils;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.bind.annotation.RestControllerAdvice;

import java.time.Instant;
import java.util.HashMap;
import java.util.Map;
import java.util.UUID;

@Slf4j
@RestControllerAdvice
public class GlobalExceptionHandler {

    @ExceptionHandler(Exception.class)
    public ResponseEntity<StandardError> handleAllExceptions(
            Exception ex,
            HttpServletRequest request
    ) {
        String message = "Unexpected internal server error";
        UUID traceId = UUID.randomUUID();

        log.error("[TraceID: {}] Internal Server Error at path: {} | Message: {}", traceId, request.getRequestURI(), ex.getMessage(), ex);

        return ResponseEntity
                .status(HttpStatus.INTERNAL_SERVER_ERROR)
                .body(buildError(message, request, traceId));
    }

    @ExceptionHandler(ResourceNotFoundException.class)
    public ResponseEntity<StandardError> handleResourceNotFoundException(
            ResourceNotFoundException exception,
            HttpServletRequest request
    ) {
        UUID traceId = UUID.randomUUID();
        log.warn("[TraceID: {}] Resource not found at path: {} | Reason: {}", traceId, request.getRequestURI(), exception.getMessage());

        return ResponseEntity
                .status(getStatus(exception))
                .body(buildError(exception.getMessage(), request, traceId));
    }

    @ExceptionHandler(BadRequestException.class)
    public ResponseEntity<StandardError> handleBadRequestException(
            BadRequestException exception,
            HttpServletRequest request
    ) {
        UUID traceId = UUID.randomUUID();
        log.warn("[TraceID: {}] Bad request at path: {} | Reason: {}", traceId, request.getRequestURI(), exception.getMessage());

        return ResponseEntity
                .status(getStatus(exception))
                .body(buildError(exception.getMessage(), request, traceId));
    }

    @ExceptionHandler(EntityInUseException.class)
    public ResponseEntity<StandardError> handleEntityInUseException(
            EntityInUseException exception,
            HttpServletRequest request
    ) {
        UUID traceId = UUID.randomUUID();
        log.warn("[TraceID: {}] Entity in use conflict at path: {} | Reason: {}", traceId, request.getRequestURI(), exception.getMessage());

        return ResponseEntity
                .status(getStatus(exception))
                .body(buildError(exception.getMessage(), request, traceId));
    }

    @ExceptionHandler(InvalidJwtAuthenticationException.class)
    public ResponseEntity<StandardError> handleInvalidJwtAuthenticationException(
            InvalidJwtAuthenticationException exception,
            HttpServletRequest request
    ) {
        UUID traceId = UUID.randomUUID();
        log.warn("[TraceID: {}] Invalid JWT authentication attempt at path: {} | Reason: {}", traceId, request.getRequestURI(), exception.getMessage());

        return ResponseEntity
                .status(getStatus(exception))
                .body(buildError(exception.getMessage(), request, traceId));
    }

    @ExceptionHandler(MethodArgumentNotValidException.class)
    public ResponseEntity<ValidationError> handleValidationException(
            MethodArgumentNotValidException exception,
            HttpServletRequest request
    ) {
        UUID traceId = UUID.randomUUID();
        Map<String, String> errors = new HashMap<>();

        exception.getBindingResult()
                .getFieldErrors()
                .forEach(error -> errors.put(error.getField(), error.getDefaultMessage()));

        log.warn("[TraceID: {}] Data validation failed at path: {} | Invalid fields: {}", traceId, request.getRequestURI(), errors.keySet());

        return ResponseEntity
                .status(HttpStatus.BAD_REQUEST)
                .body(
                        new ValidationError(
                                Instant.now(),
                                errors,
                                request.getRequestURI(),
                                traceId
                        )
                );
    }

    @ExceptionHandler(AccessDeniedException.class)
    public ResponseEntity<StandardError> handleAccessDeniedException(
            AccessDeniedException exception,
            HttpServletRequest request
    ) {
        UUID traceId = UUID.randomUUID();
        log.warn("[TraceID: {}] Access denied (Forbidden) at path: {} | User lacks required roles.", traceId, request.getRequestURI());

        return ResponseEntity
                .status(HttpStatus.FORBIDDEN)
                .body(buildError("Access denied", request, traceId));
    }

    @ExceptionHandler(BadCredentialsException.class)
    public ResponseEntity<StandardError> handleBadCredentialsException(
            BadCredentialsException exception,
            HttpServletRequest request
    ) {
        UUID traceId = UUID.randomUUID();
        log.info("[TraceID: {}] Login failure at path: {} | Reason: {}", traceId, request.getRequestURI(), exception.getMessage());

        return ResponseEntity
                .status(HttpStatus.UNAUTHORIZED)
                .body(buildError(exception.getMessage(), request, traceId));
    }

    @ExceptionHandler(EmailAlreadyExistsException.class)
    public ResponseEntity<StandardError> handleEmailAlreadyExistsException(
            EmailAlreadyExistsException exception,
            HttpServletRequest request
    ) {
        UUID traceId = UUID.randomUUID();
        log.warn("[TraceID: {}] Registration failure at path: {} | Reason: {}", traceId, request.getRequestURI(), exception.getMessage());

        return ResponseEntity
                .status(getStatus(exception))
                .body(buildError(exception.getMessage(), request, traceId));
    }

    @ExceptionHandler(JasperReportGenerationException.class)
    public ResponseEntity<StandardError> handleJasperReportGenerationException(
            JasperReportGenerationException exception,
            HttpServletRequest request
    ) {
        UUID traceId = UUID.randomUUID();
        log.error("[TraceID: {}] Jasper report generation failed at path: {} | Reason: {}", traceId, request.getRequestURI(), exception.getMessage(), exception);

        return ResponseEntity
                .status(HttpStatus.INTERNAL_SERVER_ERROR)
                .body(buildError(exception.getMessage(), request, traceId));
    }

    @ExceptionHandler(JasperPdfExportException.class)
    public ResponseEntity<StandardError> handleJasperPdfExportException(
            JasperPdfExportException exception,
            HttpServletRequest request
    ) {
        UUID traceId = UUID.randomUUID();
        log.error("[TraceID: {}] Jasper PDF export failed at path: {} | Reason: {}", traceId, request.getRequestURI(), exception.getMessage(), exception);

        return ResponseEntity
                .status(HttpStatus.INTERNAL_SERVER_ERROR)
                .body(buildError(exception.getMessage(), request, traceId));
    }

    private StandardError buildError(
            String message,
            HttpServletRequest request,
            UUID traceId
    ) {
        return new StandardError(
                Instant.now(),
                message,
                request.getRequestURI(),
                traceId
        );
    }

    private HttpStatus getStatus(Exception ex) {
        ResponseStatus annotation = AnnotatedElementUtils.findMergedAnnotation(ex.getClass(), ResponseStatus.class);
        if (annotation != null) {
            return HttpStatus.valueOf(annotation.code().value());
        }
        return HttpStatus.INTERNAL_SERVER_ERROR;
    }
}

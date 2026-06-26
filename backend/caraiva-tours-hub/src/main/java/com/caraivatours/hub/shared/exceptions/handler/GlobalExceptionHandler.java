package com.caraivatours.hub.shared.exceptions.handler;

import com.caraivatours.hub.shared.exceptions.EmailAlreadyExistsException;
import com.caraivatours.hub.shared.exceptions.InvalidAuthorizationHeaderException;
import com.caraivatours.hub.shared.exceptions.InvalidJwtAuthenticationException;
import com.caraivatours.hub.shared.exceptions.ResourceNotFoundException;
import com.caraivatours.hub.shared.exceptions.model.StandardError;
import com.caraivatours.hub.shared.exceptions.model.ValidationError;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.validation.ConstraintViolationException;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.bind.annotation.RestControllerAdvice;

import java.time.Instant;
import java.util.HashMap;
import java.util.Map;
import java.util.UUID;

@RestControllerAdvice
public class GlobalExceptionHandler {

    @ExceptionHandler(Exception.class)
    public ResponseEntity<StandardError> handleAllExceptions(
            Exception ex,
            HttpServletRequest request
    ) {
        String message = "Unexpected internal server error";

        return ResponseEntity
                .status(HttpStatus.INTERNAL_SERVER_ERROR)
                .body(buildError(message, request));
    }

    @ExceptionHandler(ResourceNotFoundException.class)
    public ResponseEntity<StandardError> handleResourceNotFoundException(
            ResourceNotFoundException exception,
            HttpServletRequest request
    ) {

        return ResponseEntity
                .status(getStatus(exception))
                .body(buildError(exception.getMessage(), request));
    }

    @ExceptionHandler(InvalidJwtAuthenticationException.class)
    public ResponseEntity<StandardError> handleInvalidJwtAuthenticationException(
            InvalidJwtAuthenticationException exception,
            HttpServletRequest request
    ) {

        return ResponseEntity
                .status(getStatus(exception))
                .body(buildError(exception.getMessage(), request));
    }

    @ExceptionHandler(MethodArgumentNotValidException.class)
    public ResponseEntity<ValidationError> handleValidationException(
            MethodArgumentNotValidException exception,
            HttpServletRequest request
    ) {

        Map<String, String> errors = new HashMap<>();

        exception.getBindingResult()
                .getFieldErrors()
                .forEach(error ->
                        errors.put(
                                error.getField(),
                                error.getDefaultMessage()
                        )
                );

        return ResponseEntity
                .status(HttpStatus.BAD_REQUEST)
                .body(
                        new ValidationError(
                                Instant.now(),
                                errors,
                                request.getRequestURI(),
                                UUID.randomUUID()
                        )
                );
    }

    @ExceptionHandler(AccessDeniedException.class)
    public ResponseEntity<StandardError> handleAccessDeniedException(
            AccessDeniedException exception,
            HttpServletRequest request
    ) {

        return ResponseEntity
                .status(HttpStatus.FORBIDDEN)
                .body(buildError("Access denied", request));
    }

    @ExceptionHandler(InvalidAuthorizationHeaderException.class)
    public ResponseEntity<StandardError> handleInvalidAuthorizationHeaderException(
            InvalidAuthorizationHeaderException exception,
            HttpServletRequest request
    ) {

        return ResponseEntity
                .status(getStatus(exception))
                .body(buildError(exception.getMessage(), request));
    }

    @ExceptionHandler(EmailAlreadyExistsException.class)
    public ResponseEntity<StandardError> handleEmailAlreadyExistsException(
            EmailAlreadyExistsException exception,
            HttpServletRequest request
    ) {
        return ResponseEntity
                .status(getStatus(exception))
                .body(buildError(exception.getMessage(), request));
    }

    private StandardError buildError(
            String message,
            HttpServletRequest request
    ) {
        return new StandardError(
                Instant.now(),
                message,
                request.getRequestURI(),
                UUID.randomUUID()
        );
    }


    private HttpStatus getStatus(Exception ex) {
        ResponseStatus annotation = ex.getClass().getAnnotation(ResponseStatus.class);

        if (annotation != null) {
            return annotation.code();
        }
        return HttpStatus.INTERNAL_SERVER_ERROR;
    }
}
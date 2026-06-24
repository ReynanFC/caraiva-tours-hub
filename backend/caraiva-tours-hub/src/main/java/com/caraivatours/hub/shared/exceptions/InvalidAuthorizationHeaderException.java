package com.caraivatours.hub.shared.exceptions;

import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.ResponseStatus;

@ResponseStatus(HttpStatus.UNAUTHORIZED)
public class InvalidAuthorizationHeaderException extends RuntimeException {
    public InvalidAuthorizationHeaderException(String message) {
        super(message);
    }
}

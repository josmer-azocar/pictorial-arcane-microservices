package com.pictorialarcane.core_service.domain.exception;

public class UserAlreadyExistsException extends RuntimeException {
    public UserAlreadyExistsException(String email) {
        super("the user with the email: " + email + " already exists");
    }
}


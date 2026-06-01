package com.pictorialarcane.core_service.domain.exception;

public class UserDoesNotExistsException extends RuntimeException {
    public UserDoesNotExistsException(String email) {
        super("the user with the email: " + email + " does not exist");
    }

    public UserDoesNotExistsException(Long dniUser) {
        super("the user with DNI: " + dniUser + " does not exist");
    }
}


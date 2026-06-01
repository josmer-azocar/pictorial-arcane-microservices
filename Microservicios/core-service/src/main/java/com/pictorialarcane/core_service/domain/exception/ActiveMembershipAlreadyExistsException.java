package com.pictorialarcane.core_service.domain.exception;

public class ActiveMembershipAlreadyExistsException extends RuntimeException {
    public ActiveMembershipAlreadyExistsException(String message) {
        super(message);
    }
}


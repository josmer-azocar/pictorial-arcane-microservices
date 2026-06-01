package com.pictorialarcane.core_service.domain.exception;

public class ActiveMembershipNotFoundException extends RuntimeException {
    public ActiveMembershipNotFoundException(String message) {
        super(message);
    }
}


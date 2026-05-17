package com.uneg.pictorialArcane.domain.exception;

public class ActiveMembershipAlreadyExistsException extends RuntimeException {
    public ActiveMembershipAlreadyExistsException(String message) {
        super(message);
    }
}


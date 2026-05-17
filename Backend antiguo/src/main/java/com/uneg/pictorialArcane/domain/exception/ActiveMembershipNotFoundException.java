package com.uneg.pictorialArcane.domain.exception;

public class ActiveMembershipNotFoundException extends RuntimeException {
    public ActiveMembershipNotFoundException(String message) {
        super(message);
    }
}


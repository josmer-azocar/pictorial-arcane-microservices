package com.uneg.pictorialArcane.domain.exception;

public class InvalidSecurityCodeException extends RuntimeException {

    public InvalidSecurityCodeException() {
        super("The provided security code is incorrect");
    }
}

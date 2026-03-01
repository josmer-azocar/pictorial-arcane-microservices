package com.uneg.pictorialArcane.domain.exception;

public class GenderDoesNotExistsException extends RuntimeException {
    public GenderDoesNotExistsException(Long id) {
        super("The Gender with id: " + id + " does not exists");
    }
}


package com.uneg.pictorialArcane.domain.exception;

public class ArtWorkNotAvailableException extends RuntimeException {

    public ArtWorkNotAvailableException(Long id) {
        super("The artwork with id " + id + " is not available for reservation");
    }
}

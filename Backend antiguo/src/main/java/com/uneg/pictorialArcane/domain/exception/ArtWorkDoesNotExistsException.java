package com.uneg.pictorialArcane.domain.exception;

public class ArtWorkDoesNotExistsException extends RuntimeException {
    public ArtWorkDoesNotExistsException(Long id) {
        super("The ArtWork with id: " + id + " does not exists");
    }
}

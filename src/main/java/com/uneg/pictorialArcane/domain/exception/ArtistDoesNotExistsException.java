package com.uneg.pictorialArcane.domain.exception;

public class ArtistDoesNotExistsException extends RuntimeException {
    public ArtistDoesNotExistsException(Long id) {

            super("The Artist with id: " + id + " does not exists");
    }
}

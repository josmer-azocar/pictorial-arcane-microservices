package com.uneg.pictorialArcane.domain.exception;

public class GenreDoesNotExistsException extends RuntimeException {
    public GenreDoesNotExistsException(Long id) {
        super("The Genre with id: " + id + " does not exists");
    }
}

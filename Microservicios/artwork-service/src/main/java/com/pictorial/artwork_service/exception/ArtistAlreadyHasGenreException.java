package com.pictorial.artwork_service.exception;

public class ArtistAlreadyHasGenreException extends RuntimeException {
    public ArtistAlreadyHasGenreException(String message) {
        super(message);
    }
}

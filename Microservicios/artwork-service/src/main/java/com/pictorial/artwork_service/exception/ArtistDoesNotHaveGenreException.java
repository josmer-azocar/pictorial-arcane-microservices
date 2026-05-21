package com.pictorial.artwork_service.exception;

public class ArtistDoesNotHaveGenreException extends RuntimeException {
    public ArtistDoesNotHaveGenreException(String message) {
        super(message);
    }
}

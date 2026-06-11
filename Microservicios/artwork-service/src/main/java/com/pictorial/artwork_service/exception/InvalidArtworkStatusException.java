package com.pictorial.artwork_service.exception;

/**
 * Se lanza cuando una transición de estado de obra no es válida
 * (p. ej. intentar reservar una obra que no está AVAILABLE).
 */
public class InvalidArtworkStatusException extends RuntimeException {
    public InvalidArtworkStatusException(String message) {
        super(message);
    }
}

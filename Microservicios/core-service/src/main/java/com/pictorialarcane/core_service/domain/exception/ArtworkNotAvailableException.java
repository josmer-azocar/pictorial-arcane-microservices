package com.pictorialarcane.core_service.domain.exception;

/**
 * Se lanza cuando artwork-service no puede reservar/transicionar una obra
 * (no existe, no está disponible, o el servicio no responde).
 */
public class ArtworkNotAvailableException extends RuntimeException {
    public ArtworkNotAvailableException(String message) {
        super(message);
    }
}

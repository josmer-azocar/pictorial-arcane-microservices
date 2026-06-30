package com.pictorial.recommendation_service.web.exception;

import java.time.LocalDateTime;

/**
 * Cuerpo estándar de respuesta de error de la API.
 */
public record Error(int status, String message, LocalDateTime timestamp) {

    public Error(int status, String message) {
        this(status, message, LocalDateTime.now());
    }
}
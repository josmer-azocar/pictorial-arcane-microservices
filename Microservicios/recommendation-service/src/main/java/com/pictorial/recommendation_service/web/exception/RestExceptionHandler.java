package com.pictorial.recommendation_service.web.exception;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;

/**
 * Manejo centralizado de excepciones para los endpoints REST del servicio.
 */
@RestControllerAdvice
public class RestExceptionHandler {

    @ExceptionHandler(ResourceNotFoundException.class)
    public ResponseEntity<Error> handleResourceNotFound(ResourceNotFoundException ex) {
        Error error = new Error(HttpStatus.NOT_FOUND.value(), ex.getMessage());
        return ResponseEntity.status(HttpStatus.NOT_FOUND).body(error);
    }

    @ExceptionHandler(IllegalArgumentException.class)
    public ResponseEntity<Error> handleIllegalArgument(IllegalArgumentException ex) {
        Error error = new Error(HttpStatus.BAD_REQUEST.value(), ex.getMessage());
        return ResponseEntity.badRequest().body(error);
    }

    @ExceptionHandler(Exception.class)
    public ResponseEntity<Error> handleGeneral(Exception ex) {
        Error error = new Error(HttpStatus.INTERNAL_SERVER_ERROR.value(), ex.getMessage());
        return ResponseEntity.internalServerError().body(error);
    }
}

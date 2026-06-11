package com.pictorial.artwork_service.web.exception;

import com.pictorial.artwork_service.exception.ArtistAlreadyHasGenreException;
import com.pictorial.artwork_service.exception.ArtistDoesNotHaveGenreException;
import com.pictorial.artwork_service.exception.DuplicateResourceException;
import com.pictorial.artwork_service.exception.InvalidArtworkStatusException;
import com.pictorial.artwork_service.exception.ResourceNotFoundException;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;

import java.util.ArrayList;
import java.util.List;

@RestControllerAdvice
public class RestExceptionHandler {

    @ExceptionHandler(ResourceNotFoundException.class)
    public ResponseEntity<Error> handleResourceNotFound(ResourceNotFoundException ex) {
        Error error = new Error(ex.getResourceType() + "-not-found", ex.getMessage());
        return ResponseEntity.status(HttpStatus.NOT_FOUND).body(error);
    }

    @ExceptionHandler(DuplicateResourceException.class)
    public ResponseEntity<Error> handleDuplicate(DuplicateResourceException ex) {
        Error error = new Error("duplicate-resource", ex.getMessage());
        return ResponseEntity.badRequest().body(error);
    }

    @ExceptionHandler(InvalidArtworkStatusException.class)
    public ResponseEntity<Error> handleInvalidArtworkStatus(InvalidArtworkStatusException ex) {
        Error error = new Error("invalid-artwork-status", ex.getMessage());
        return ResponseEntity.status(HttpStatus.CONFLICT).body(error);
    }

    @ExceptionHandler(ArtistAlreadyHasGenreException.class)
    public ResponseEntity<Error> handleArtistAlreadyHasGenre(ArtistAlreadyHasGenreException ex) {
        Error error = new Error("artist-already-has-genre", ex.getMessage());
        return ResponseEntity.badRequest().body(error);
    }

    @ExceptionHandler(ArtistDoesNotHaveGenreException.class)
    public ResponseEntity<Error> handleArtistDoesNotHaveGenre(ArtistDoesNotHaveGenreException ex) {
        Error error = new Error("artist-does-not-have-genre", ex.getMessage());
        return ResponseEntity.badRequest().body(error);
    }

    @ExceptionHandler(IllegalArgumentException.class)
    public ResponseEntity<Error> handleIllegalArgument(IllegalArgumentException ex) {
        Error error = new Error("invalid-argument", ex.getMessage());
        return ResponseEntity.badRequest().body(error);
    }

    @ExceptionHandler(MethodArgumentNotValidException.class)
    public ResponseEntity<List<Error>> handleValidation(MethodArgumentNotValidException ex) {
        List<Error> errors = new ArrayList<>();
        ex.getBindingResult().getFieldErrors().forEach(error ->
            errors.add(new Error(error.getField(), error.getDefaultMessage()))
        );
        return ResponseEntity.badRequest().body(errors);
    }

    @ExceptionHandler(Exception.class)
    public ResponseEntity<Error> handleGeneral(Exception ex) {
        Error error = new Error("unknown-error", ex.getMessage());
        return ResponseEntity.internalServerError().body(error);
    }
}

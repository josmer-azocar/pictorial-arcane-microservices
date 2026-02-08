package com.uneg.pictorialArcane.web.exception;


import com.uneg.pictorialArcane.domain.exception.ArtWorkDoesNotExistsException;
import com.uneg.pictorialArcane.domain.exception.ArtistDoesNotExistsException;
import com.uneg.pictorialArcane.domain.exception.UserAlreadyExistsException;
import com.uneg.pictorialArcane.domain.exception.UserDoesNotExistsException;
import org.apache.coyote.BadRequestException;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;

import java.util.ArrayList;
import java.util.List;

@RestControllerAdvice
public class RestExceptionHandler {

    @ExceptionHandler(UserAlreadyExistsException.class)
    public ResponseEntity<Error> handleException(UserAlreadyExistsException ex){
        Error error = new Error("email-already-exists", ex.getMessage());
        return ResponseEntity.badRequest().body(error);
    }

    @ExceptionHandler(BadRequestException.class)
    public ResponseEntity<Error> handleBadRequestException(BadRequestException exception){
        Error error = new Error("error-in-the-request",
                exception.getMessage());
        return ResponseEntity.badRequest().body(error);
    }

    @ExceptionHandler(UserDoesNotExistsException.class)
    public ResponseEntity<Error> handleException(UserDoesNotExistsException ex){
        Error error = new Error("user-does-not-exist", ex.getMessage());
        return ResponseEntity.status(HttpStatus.NOT_FOUND).body(error);
    }

    @ExceptionHandler(ArtWorkDoesNotExistsException.class)
    public ResponseEntity<Error> handleException(ArtWorkDoesNotExistsException ex){
        Error error = new Error("artwork-does-not-exist", ex.getMessage());
        return ResponseEntity.status(HttpStatus.NOT_FOUND).body(error);
    }

    @ExceptionHandler(MethodArgumentNotValidException.class)
    public ResponseEntity<List<Error>> handleException(MethodArgumentNotValidException ex){
        List<Error> errors = new ArrayList<>();

        ex.getBindingResult().getFieldErrors().forEach(error -> {
            errors.add(new Error(error.getField(), error.getDefaultMessage()));
        });
        return ResponseEntity.badRequest().body(errors);
    }

    @ExceptionHandler(Exception.class)
    public ResponseEntity<Error> handleException(Exception ex){
        Error error = new Error("unknown-error", ex.getMessage());
        return ResponseEntity.internalServerError().body(error);
    }

    @ExceptionHandler(ArtistDoesNotExistsException.class)
    public ResponseEntity<Error> handleException(ArtistDoesNotExistsException ex){
        Error error = new Error("artist-does-not-exist", ex.getMessage());
        return ResponseEntity.status(HttpStatus.NOT_FOUND).body(error);
    }
}

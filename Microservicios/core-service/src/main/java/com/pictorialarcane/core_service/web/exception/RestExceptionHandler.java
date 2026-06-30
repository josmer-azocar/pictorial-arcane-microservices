package com.pictorialarcane.core_service.web.exception;


import com.pictorialarcane.core_service.domain.exception.*;
import org.apache.coyote.BadRequestException;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.security.authentication.AnonymousAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;

import java.util.ArrayList;
import java.util.List;

@RestControllerAdvice
public class RestExceptionHandler {

    // Traduce las denegaciones de @PreAuthorize a 401 (anónimo) / 403 (autenticado sin rol),
    // evitando que el handler genérico de Exception las enmascare como 500.
    @ExceptionHandler(AccessDeniedException.class)
    public ResponseEntity<Error> handleAccessDenied(AccessDeniedException ex) {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        boolean anonymous = (auth == null) || (auth instanceof AnonymousAuthenticationToken);
        HttpStatus status = anonymous ? HttpStatus.UNAUTHORIZED : HttpStatus.FORBIDDEN;
        String type = anonymous ? "unauthorized" : "forbidden";
        String message = anonymous
                ? "No estas autenticado"
                : "Acceso denegado: No tienes el rol necesario";
        return ResponseEntity.status(status).body(new Error(type, message));
    }

    @ExceptionHandler(UserAlreadyExistsException.class)
    public ResponseEntity<Error> handleException(UserAlreadyExistsException ex){
        Error error = new Error("email-already-exists", ex.getMessage());
        return ResponseEntity.badRequest().body(error);
    }

    @ExceptionHandler(SaleException.class)
    public ResponseEntity<Error> handleException(SaleException ex){
        Error error = new Error("sale-error", ex.getMessage());
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

    @ExceptionHandler(AnswersAreNotCorrectException.class)
    public ResponseEntity<Error> handleException(AnswersAreNotCorrectException ex){
        Error error = new Error("the-answers-are-not-correct", ex.getMessage());
        return ResponseEntity.badRequest().body(error);
    }

    @ExceptionHandler(QuestionDoesNotExistsException.class)
    public ResponseEntity<Error> handleException(QuestionDoesNotExistsException ex){
        Error error = new Error("question-does-not-exist", ex.getMessage());
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

    @ExceptionHandler(SaleDoesNotExistsException.class)
    public ResponseEntity<Error> handleException(SaleDoesNotExistsException ex){
        Error error = new Error("sale-does-not-exist", ex.getMessage());
        return ResponseEntity.status(HttpStatus.NOT_FOUND).body(error);
    }

    @ExceptionHandler(CommissionRateIncorrectException.class)
    public ResponseEntity<Error> handleException(CommissionRateIncorrectException ex){
        Error error = new Error("unknown-error", ex.getMessage());
        return ResponseEntity.status(HttpStatus.NOT_FOUND).body(error);
    }

    @ExceptionHandler(ActiveMembershipNotFoundException.class)
    public ResponseEntity<Error> handleException(ActiveMembershipNotFoundException ex){
        Error error = new Error("active-membership-not-found", ex.getMessage());
        return ResponseEntity.status(HttpStatus.NOT_FOUND).body(error);
    }

    @ExceptionHandler(ActiveMembershipAlreadyExistsException.class)
    public ResponseEntity<Error> handleException(ActiveMembershipAlreadyExistsException ex){
        Error error = new Error("active-membership-already-exists", ex.getMessage());
        return ResponseEntity.badRequest().body(error);
    }


    @ExceptionHandler(IllegalArgumentException.class)
    public ResponseEntity<Error> handleException(IllegalArgumentException ex){
        Error error = new Error("invalid-argument", ex.getMessage());
        return ResponseEntity.badRequest().body(error);
    }

    @ExceptionHandler(ArtworkNotAvailableException.class)
    public ResponseEntity<Error> handleException(ArtworkNotAvailableException ex){
        Error error = new Error("artwork-not-available", ex.getMessage());
        return ResponseEntity.status(HttpStatus.CONFLICT).body(error);
    }
}

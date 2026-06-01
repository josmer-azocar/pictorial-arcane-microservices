package com.pictorialarcane.core_service.domain.exception;

public class QuestionDoesNotExistsException extends RuntimeException {
    public QuestionDoesNotExistsException(Long idQuestion) {
        super("Question with id " + idQuestion + " does not exist.");
    }
}

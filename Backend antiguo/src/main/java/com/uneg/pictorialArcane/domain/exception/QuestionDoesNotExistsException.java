package com.uneg.pictorialArcane.domain.exception;

public class QuestionDoesNotExistsException extends RuntimeException {
    public QuestionDoesNotExistsException(Long idQuestion) {
        super("Question with id " + idQuestion + " does not exist.");
    }
}

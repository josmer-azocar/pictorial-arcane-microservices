package com.pictorialarcane.core_service.domain.exception;

public class AnswersAreNotCorrectException extends RuntimeException {
    public AnswersAreNotCorrectException() {
        super("the answers are not correct");
    }
}

package com.uneg.pictorialArcane.domain.exception;

public class AnswersAreNotCorrectException extends RuntimeException {
    public AnswersAreNotCorrectException() {
        super("the answers are not correct");
    }
}

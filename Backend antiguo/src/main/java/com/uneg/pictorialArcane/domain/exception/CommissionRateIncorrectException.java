package com.uneg.pictorialArcane.domain.exception;

public class CommissionRateIncorrectException extends RuntimeException {
    public CommissionRateIncorrectException() {
            super("The artist's commission should be between 5% and 10%.");
    }
}

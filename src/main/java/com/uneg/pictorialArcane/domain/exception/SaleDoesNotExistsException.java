package com.uneg.pictorialArcane.domain.exception;

public class SaleDoesNotExistsException extends RuntimeException {
    public SaleDoesNotExistsException(Long saleId) {
        super("Sale with id " + saleId + " does not exist.");
    }
}

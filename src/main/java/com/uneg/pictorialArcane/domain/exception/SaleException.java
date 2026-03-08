package com.uneg.pictorialArcane.domain.exception;

import com.uneg.pictorialArcane.domain.Enum.SaleStatus;

public class SaleException extends RuntimeException {
    public SaleException(Long id) {
        super("The status of Sale with id: " + id + " has already been updated before, so it cannot be confirm");
    }

    public SaleException(Long id, String saleStatus){
        super("The operation could not succeed because the sale with id: " + id + " is " + saleStatus + " with this status this operation is not available");
    }
}

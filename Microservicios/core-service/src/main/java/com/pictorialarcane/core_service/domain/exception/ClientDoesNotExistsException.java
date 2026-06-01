package com.pictorialarcane.core_service.domain.exception;

public class ClientDoesNotExistsException extends RuntimeException {

    public ClientDoesNotExistsException(Long dniUser) {
        super("Client does not exist for dni: " + dniUser);
    }
}


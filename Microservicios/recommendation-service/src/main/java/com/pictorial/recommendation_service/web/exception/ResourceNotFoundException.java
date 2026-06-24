package com.pictorial.recommendation_service.web.exception;

/**
 * Se lanza cuando un recurso solicitado (p. ej. un Comprador o una Obra)
 * no existe en el grafo de Neo4j.
 */
public class ResourceNotFoundException extends RuntimeException {

    public ResourceNotFoundException(String message) {
        super(message);
    }
}

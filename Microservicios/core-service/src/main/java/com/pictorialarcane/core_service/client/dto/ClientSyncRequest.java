package com.pictorialarcane.core_service.client.dto;

/**
 * Payload enviado al recommendation-service para crear/actualizar el nodo (:Comprador)
 * en el grafo Neo4j cuando se registra un cliente. Los nombres de campo deben coincidir
 * con ClientSyncRequestDto del recommendation-service.
 *
 * @param compradorId identificador del comprador (dniUser del cliente como String)
 * @param name        nombre completo del cliente
 * @param email       email del cliente
 */
public record ClientSyncRequest(
        String compradorId,
        String name,
        String email
) {}

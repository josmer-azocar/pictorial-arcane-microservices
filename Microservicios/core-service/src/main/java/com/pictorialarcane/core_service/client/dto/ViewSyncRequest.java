package com.pictorialarcane.core_service.client.dto;

/**
 * Payload enviado al recommendation-service para materializar la relación
 * (Comprador)-[:SAW]->(Artwork) en el grafo Neo4j. Los nombres de campo deben
 * coincidir con ViewSyncRequestDto del recommendation-service.
 *
 * @param compradorId identificador del comprador (dniUser del cliente como String)
 * @param artworkId   clave de negocio de la obra vista
 * @param fecha       fecha de la vista en formato ISO-8601, ej: "2025-06-14T10:30:00"
 */
public record ViewSyncRequest(
        String compradorId,
        Long artworkId,
        String fecha
) {}

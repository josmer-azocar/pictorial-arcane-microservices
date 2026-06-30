package com.pictorialarcane.core_service.client.dto;

/**
 * Payload enviado al recommendation-service para materializar la relación
 * (Comprador)-[:BOUGHT]->(Artwork) en el grafo Neo4j. Los nombres de campo deben
 * coincidir con PurchaseSyncRequestDto del recommendation-service.
 *
 * @param compradorId identificador del comprador (dniUser del cliente como String)
 * @param artworkId   clave de negocio de la obra
 * @param fecha       fecha de la compra en formato ISO-8601, ej: "2025-06-14T00:00:00"
 */
public record PurchaseSyncRequest(
        String compradorId,
        Long artworkId,
        String fecha
) {}

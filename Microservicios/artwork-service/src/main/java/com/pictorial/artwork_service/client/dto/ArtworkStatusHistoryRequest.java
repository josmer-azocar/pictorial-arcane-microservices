package com.pictorial.artwork_service.client.dto;

/**
 * Payload enviado al audit-service para registrar un cambio de estado de obra
 * (tabla artwork_status_history en Cassandra). Los nombres de campo deben coincidir
 * con ArtworkStatusHistoryRequestDto del audit-service.
 */
public record ArtworkStatusHistoryRequest(
        Long artworkId,
        String artworkName,
        Long changedBy,
        String newStatus,
        String oldStatus,
        String reason
) {}

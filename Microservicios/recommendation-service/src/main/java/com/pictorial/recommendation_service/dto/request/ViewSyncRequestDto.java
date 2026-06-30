package com.pictorial.recommendation_service.dto.request;

/**
 * DTO de entrada para sincronizar una vista (endpoint sync/view -> SYNC.3).
 * El campo {@code fecha} se espera en formato ISO-8601, ej: "2025-06-14T10:30:00".
 */
public record ViewSyncRequestDto(
        String compradorId,
        Long artworkId,
        String fecha
) {}

package com.pictorial.recommendation_service.dto.request;

/**
 * DTO de entrada para sincronizar una compra (endpoint 8 -> SYNC.1).
 * El campo {@code fecha} se espera en formato ISO-8601, ej: "2025-06-14T10:30:00".
 */
public record PurchaseSyncRequestDto(
        String compradorId,
        Long artworkId,
        String fecha
) {}

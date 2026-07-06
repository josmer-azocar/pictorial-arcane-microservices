package com.pictorial.recommendation_service.dto.response;

/**
 * DTO de respuesta para el historial de compras de un usuario (endpoint 3).
 */
public record PurchaseHistoryResponseDto(
        String compradorName,
        String artworkName,
        String artistName,
        String genreName,
        String purchaseDate,
        String imageUrl
) {}

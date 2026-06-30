package com.pictorial.recommendation_service.dto.response;

/**
 * DTO de respuesta para el top de obras más compradas (endpoint 4).
 */
public record TopArtworkResponseDto(
        Long artworkId,
        String name,
        Long timesComprada
) {}

package com.pictorial.recommendation_service.dto.response;

/**
 * DTO de respuesta para el top de artistas más populares (endpoint 5).
 */
public record TopArtistResponseDto(
        String artistName,
        Long salesCount
) {}

package com.pictorial.recommendation_service.dto.response;

/**
 * DTO de respuesta para las recomendaciones de obras (endpoints 1, 2, 6 y 7).
 */
public record ArtworkRecommendationResponseDto(
        Long artworkId,
        String name,
        String genreName,
        Double price
) {}

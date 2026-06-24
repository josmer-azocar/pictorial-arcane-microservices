package com.pictorial.recommendation_service.mapper;

import com.pictorial.recommendation_service.core.ArtworkRecommendationProjection;
import com.pictorial.recommendation_service.dto.response.ArtworkRecommendationResponseDto;
import org.springframework.stereotype.Component;

import java.util.List;

/**
 * Convierte las proyecciones de recomendación de obras en DTOs de respuesta.
 */
@Component
public class ArtworkRecommendationMapper {

    public ArtworkRecommendationResponseDto toDto(ArtworkRecommendationProjection projection) {
        return new ArtworkRecommendationResponseDto(
                projection.artworkId(),
                projection.obra(),
                projection.genero(),
                projection.precio()
        );
    }

    public List<ArtworkRecommendationResponseDto> toDtoList(List<ArtworkRecommendationProjection> projections) {
        return projections.stream().map(this::toDto).toList();
    }
}

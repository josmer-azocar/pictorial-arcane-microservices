package com.pictorial.recommendation_service.mapper;

import com.pictorial.recommendation_service.core.TopArtworkProjection;
import com.pictorial.recommendation_service.dto.response.TopArtworkResponseDto;
import org.springframework.stereotype.Component;

import java.util.List;

/**
 * Convierte las proyecciones del top de obras más compradas en DTOs de respuesta.
 */
@Component
public class TopArtworkMapper {

    public TopArtworkResponseDto toDto(TopArtworkProjection projection) {
        return new TopArtworkResponseDto(
                projection.id(),
                projection.obra(),
                projection.vecesComprada()
        );
    }

    public List<TopArtworkResponseDto> toDtoList(List<TopArtworkProjection> projections) {
        return projections.stream().map(this::toDto).toList();
    }
}

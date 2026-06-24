package com.pictorial.recommendation_service.mapper;

import com.pictorial.recommendation_service.core.TopArtistProjection;
import com.pictorial.recommendation_service.dto.response.TopArtistResponseDto;
import org.springframework.stereotype.Component;

import java.util.List;

/**
 * Convierte las proyecciones del top de artistas más populares en DTOs de respuesta.
 */
@Component
public class TopArtistMapper {

    public TopArtistResponseDto toDto(TopArtistProjection projection) {
        return new TopArtistResponseDto(
                projection.artista(),
                projection.ventas()
        );
    }

    public List<TopArtistResponseDto> toDtoList(List<TopArtistProjection> projections) {
        return projections.stream().map(this::toDto).toList();
    }
}

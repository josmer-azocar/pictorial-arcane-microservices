package com.pictorial.recommendation_service.dto.response;

import com.pictorial.recommendation_service.nodes.ArtworkNode;
import org.springframework.data.domain.Page;

/**
 * DTO de respuesta para la búsqueda semántica (/api/v1/artworks/search-smart).
 */
public record SearchSmartResponseDto(
        String mensaje,
        Page<ArtworkNode> obras
) {}

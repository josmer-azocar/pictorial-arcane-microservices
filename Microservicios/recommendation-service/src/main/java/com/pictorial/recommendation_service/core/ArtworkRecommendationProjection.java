package com.pictorial.recommendation_service.core;

/**
 * Proyección por DTO para las recomendaciones de obras (queries 7.1, 7.2, 7.6 y 7.7).
 * Los componentes coinciden con los alias de las consultas Cypher: id, obra, genero, precio.
 * Se usa un record (DTO) en lugar de una interfaz porque Spring Data Neo4j mapea las
 * columnas escalares de una consulta a un DTO por nombre, pero trata las proyecciones por
 * interfaz como respaldadas por la entidad de dominio.
 */
public record ArtworkRecommendationProjection(
        Long artworkId,
        String obra,
        String genero,
        Double precio,
        String imageUrl
) {}

package com.pictorial.recommendation_service.core;

/**
 * Proyección por DTO para el top de obras más compradas (query 7.4).
 * Los componentes coinciden con los alias de la consulta Cypher: id, obra, vecesComprada.
 */
public record TopArtworkProjection(
        Long id,
        String obra,
        Long vecesComprada
) {}
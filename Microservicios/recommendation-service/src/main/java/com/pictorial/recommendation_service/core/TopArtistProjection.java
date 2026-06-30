package com.pictorial.recommendation_service.core;

/**
 * Proyección por DTO para el top de artistas más populares por ventas (query 7.5).
 * Los componentes coinciden con los alias de la consulta Cypher: artista, ventas.
 */
public record TopArtistProjection(
        String artista,
        Long ventas
) {}

package com.pictorial.recommendation_service.core;

import java.time.ZonedDateTime;

/**
 * Proyección por DTO para el historial de compras (query 7.3).
 * Los componentes coinciden con los alias de la consulta Cypher:
 * comprador, obra, artista, genero, fechaCompra.
 * Se usa un record (DTO) en lugar de una interfaz porque Spring Data Neo4j mapea las
 * columnas escalares de una consulta a un DTO por nombre, pero trata las proyecciones por
 * interfaz como respaldadas por la entidad de dominio.
 */
public record PurchaseHistoryProjection(
        String comprador,
        String obra,
        String artista,
        String genero,
        ZonedDateTime fechaCompra,
        String imageUrl
) {}
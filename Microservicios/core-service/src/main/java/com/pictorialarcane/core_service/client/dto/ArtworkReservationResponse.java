package com.pictorialarcane.core_service.client.dto;

/**
 * Espejo del ArtWorkResponseDto de artwork-service. Los nombres de campo deben
 * coincidir con la respuesta JSON de POST /artwork/reserve/{id} para permitir
 * capturar el nombre de la obra sin una llamada HTTP adicional.
 */
public record ArtworkReservationResponse(
        String id,
        Long artworkId,
        String name,
        String status,
        double price,
        String artistId,
        String artistName,
        String genreId,
        String genreName,
        String imageUrl
) {}

package com.pictorial.artwork_service.dto.response;

import com.pictorial.artwork_service.document.ArtWorkStatus;

public record ArtWorkResponseDto(
        String id,
        String name,
        ArtWorkStatus status,
        double price,
        String artistId,
        String artistName,
        String genreId,
        String genreName,
        String imageUrl
) {}

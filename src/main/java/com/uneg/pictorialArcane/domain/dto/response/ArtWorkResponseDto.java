package com.uneg.pictorialArcane.domain.dto.response;

public record ArtWorkResponseDto(
        Long idArtWork,
        String name,
        String status,
        double prize
) {
}

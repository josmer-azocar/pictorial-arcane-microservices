package com.uneg.pictorialArcane.domain.dto.response;

import com.uneg.pictorialArcane.domain.Enum.ArtWorkStatus;

public record ArtWorkResponseDto(
        Long idArtWork,
        String name,
        ArtWorkStatus status,
        Double price,
        Long idArtist,
        Long idGenre,
        String imageUrl

) {
}

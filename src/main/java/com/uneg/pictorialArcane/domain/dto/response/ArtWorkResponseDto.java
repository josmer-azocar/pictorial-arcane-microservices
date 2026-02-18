package com.uneg.pictorialArcane.domain.dto.response;

import com.uneg.pictorialArcane.persistence.entity.ArtistEntity;

public record ArtWorkResponseDto(
        Long idArtWork,
        String name,
        String status,
        double prize,
        Long idArtist,
        Long idGender

) {
}

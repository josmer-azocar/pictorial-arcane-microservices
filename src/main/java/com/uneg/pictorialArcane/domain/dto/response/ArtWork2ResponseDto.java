package com.uneg.pictorialArcane.domain.dto.response;

import com.uneg.pictorialArcane.domain.Enum.ArtWorkStatus;

public record ArtWork2ResponseDto(
        Long idArtWork,
        String name,
        ArtWorkStatus status,
        Double price,
        String artist,
        String gender,
        String imageUrl
) {
}

package com.uneg.pictorialArcane.domain.dto.response;

public record ArtWork2ResponseDto(
        Long idArtWork,
        String name,
        String status,
        double price,
        String artist,
        String gender
) {
}

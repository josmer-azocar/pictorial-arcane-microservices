package com.uneg.pictorialArcane.domain.dto.response;

public record ArtWork2ResponseDto(
        Long idArtWork,
        String name,
        String status,
        Double price,
        String artist,
        String gender
) {
}

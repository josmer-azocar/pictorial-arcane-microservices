package com.uneg.pictorialArcane.domain.dto.response;

public record SculptureResponseDto(
        Long idArtWork,
        String material,
        Double weight,
        Double length,
        Double width,
        Double depth
) {
}

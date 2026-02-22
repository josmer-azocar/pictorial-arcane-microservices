package com.uneg.pictorialArcane.domain.dto.response;

public record PaintingResponseDto(
        Long idArtWork,

        String technique,

        String holder,

        String style,

        String framed,

        Double width,

        Double height
) {
}

package com.uneg.pictorialArcane.domain.dto.response;

public record ContainerPaintingResponseDto(
        ArtWorkResponseDto artWorkResponse,

        PaintingResponseDto paintingResponse
) {
}

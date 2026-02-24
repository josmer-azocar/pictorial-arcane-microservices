package com.uneg.pictorialArcane.domain.dto.response;

public record ContainerSculptureResponseDto(
        SculptureResponseDto sculptureResponse,
        ArtWorkResponseDto artworkResponse
) {
}

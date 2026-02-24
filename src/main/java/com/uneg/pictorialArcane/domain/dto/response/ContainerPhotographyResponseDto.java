package com.uneg.pictorialArcane.domain.dto.response;

public record ContainerPhotographyResponseDto(
        ArtWorkResponseDto artworkResponse,

        PhotographyResponseDto photographyResponse
) {
}

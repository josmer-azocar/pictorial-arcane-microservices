package com.uneg.pictorialArcane.domain.dto.response;

public record ContainerGoldsmithResponseDto(
        ArtWorkResponseDto artworkResponse,

        GoldsmithResponseDto goldsmithResponse
) {
}

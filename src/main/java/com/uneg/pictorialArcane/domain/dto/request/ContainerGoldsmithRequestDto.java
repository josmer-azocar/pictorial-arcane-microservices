package com.uneg.pictorialArcane.domain.dto.request;

import jakarta.validation.constraints.NotNull;

public record ContainerGoldsmithRequestDto(
        @NotNull
        ArtWorkRequestDto artWorkRequest,

        @NotNull
        GoldsmithRequestDto goldsmithRequest
) {
}

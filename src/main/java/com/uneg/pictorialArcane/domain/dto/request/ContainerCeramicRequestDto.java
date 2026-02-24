package com.uneg.pictorialArcane.domain.dto.request;

import jakarta.validation.constraints.NotNull;

public record ContainerCeramicRequestDto(
        @NotNull
        ArtWorkRequestDto artWorkRequest,

        @NotNull
        CeramicRequestDto ceramicRequest
) {
}

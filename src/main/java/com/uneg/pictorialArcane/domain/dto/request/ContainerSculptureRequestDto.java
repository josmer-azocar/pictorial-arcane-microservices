package com.uneg.pictorialArcane.domain.dto.request;

import jakarta.validation.constraints.NotNull;

public record ContainerSculptureRequestDto(
        @NotNull
        ArtWorkRequestDto artWorkRequest,

        @NotNull
        SculptureRequestDto sculptureRequest
) {
}

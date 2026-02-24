package com.uneg.pictorialArcane.domain.dto.request;

import jakarta.validation.constraints.NotNull;

public record ContainerPaintingRequestDto(
        @NotNull
        ArtWorkRequestDto artWorkRequest,

        @NotNull
        PaintingRequestDto paintingRequest) {
}

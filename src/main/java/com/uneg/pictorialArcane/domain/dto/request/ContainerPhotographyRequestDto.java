package com.uneg.pictorialArcane.domain.dto.request;

import jakarta.validation.constraints.NotNull;

public record ContainerPhotographyRequestDto(
        @NotNull
        ArtWorkRequestDto artWorkRequest,

        @NotNull
        PhotographyRequestDto photographyRequest
) {
}

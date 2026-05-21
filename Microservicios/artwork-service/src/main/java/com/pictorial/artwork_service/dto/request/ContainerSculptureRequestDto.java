package com.pictorial.artwork_service.dto.request;

import jakarta.validation.constraints.NotNull;

public record ContainerSculptureRequestDto(
        @NotNull ArtWorkRequestDto artWorkRequest,
        @NotNull SculptureRequestDto sculptureRequest
) {}

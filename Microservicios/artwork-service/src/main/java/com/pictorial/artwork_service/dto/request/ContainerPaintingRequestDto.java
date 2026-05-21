package com.pictorial.artwork_service.dto.request;

import jakarta.validation.constraints.NotNull;

public record ContainerPaintingRequestDto(
        @NotNull ArtWorkRequestDto artWorkRequest,
        @NotNull PaintingRequestDto paintingRequest
) {}

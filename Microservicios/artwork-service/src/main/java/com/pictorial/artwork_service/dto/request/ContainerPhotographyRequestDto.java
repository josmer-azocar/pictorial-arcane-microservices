package com.pictorial.artwork_service.dto.request;

import jakarta.validation.constraints.NotNull;

public record ContainerPhotographyRequestDto(
        @NotNull ArtWorkRequestDto artWorkRequest,
        @NotNull PhotographyRequestDto photographyRequest
) {}

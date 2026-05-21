package com.pictorial.artwork_service.dto.request;

import jakarta.validation.constraints.NotNull;

public record ContainerGoldsmithRequestDto(
        @NotNull ArtWorkRequestDto artWorkRequest,
        @NotNull GoldsmithRequestDto goldsmithRequest
) {}

package com.pictorial.artwork_service.dto.request;

import com.pictorial.artwork_service.document.ArtWorkStatus;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;

public record UpdateArtWorkDto(
        @NotNull(message = "name cant be null") String name,
        @NotNull ArtWorkStatus status,
        @Positive double price
) {}

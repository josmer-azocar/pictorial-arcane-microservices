package com.pictorial.artwork_service.dto.request;

import com.pictorial.artwork_service.document.ArtWorkStatus;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;

public record UpdateArtWorkDto(
        @NotBlank(message = "name cant be blank") String name,
        @NotNull(message = "status cant be null") ArtWorkStatus status,
        @NotNull(message = "price cant be null") @Positive(message = "price must be positive") Double price
) {}

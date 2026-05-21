package com.pictorial.artwork_service.dto.request;

import com.pictorial.artwork_service.document.ArtWorkStatus;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;

public record ArtWorkRequestDto(
        @NotNull(message = "name cant be null")
        String name,

        @NotNull
        ArtWorkStatus status,

        @Positive
        Double price,

        @NotNull
        String idArtist,

        @NotNull
        String idGenre
) {}

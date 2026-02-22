package com.uneg.pictorialArcane.domain.dto.request;

import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;

public record ArtWorkRequestDto(

        @NotNull(message = "name cant be null")
        String name,

        @NotNull
        String status,

        @Positive
        double price,

        @NotNull
        Long idArtist,

        @NotNull
        Long idGender

) {
}

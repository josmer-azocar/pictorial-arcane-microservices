package com.uneg.pictorialArcane.domain.dto.request;

import com.uneg.pictorialArcane.domain.Enum.ArtWorkStatus;
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
        Long idArtist,

        @NotNull
        Long idGenre

) {
}

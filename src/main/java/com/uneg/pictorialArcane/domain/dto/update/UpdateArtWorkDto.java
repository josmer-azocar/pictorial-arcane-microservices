package com.uneg.pictorialArcane.domain.dto.update;

import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;

public record UpdateArtWorkDto(

        @NotNull(message = "name cant be null")
        String name,

        @NotNull
        String status,

        @Positive
        double prize
) {
}

package com.uneg.pictorialArcane.domain.dto.request;

import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;

public record CeramicRequestDto(
        @NotNull
        String materialType,

        @NotNull
        String technique,

        @NotNull
        String finish,

        @Positive
        Double cookingTemperature,

        @Positive
        Double weight,

        @Positive
        Double width,

        @Positive
        Double height
) {
}

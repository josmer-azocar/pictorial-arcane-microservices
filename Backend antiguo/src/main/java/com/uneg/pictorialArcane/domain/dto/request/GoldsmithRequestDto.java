package com.uneg.pictorialArcane.domain.dto.request;

import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;

public record GoldsmithRequestDto(
        @NotNull
        String material,

        @NotNull
        String preciousStones,

        @Positive
        Double weight
) {
}

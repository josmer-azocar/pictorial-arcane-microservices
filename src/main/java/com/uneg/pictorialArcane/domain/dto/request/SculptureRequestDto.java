package com.uneg.pictorialArcane.domain.dto.request;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;

public record SculptureRequestDto(
        @NotNull(message = "idArtWork cant be null")
        Long idArtWork,    // id que vincula a la obra

        @NotBlank(message = "material cant be blank")
        String material,

        @Positive(message = "weight must be positive")
        Double weight,

        @Positive(message = "length must be positive")
        Double length,

        @Positive(message = " must be positive")
        Double width,

        @Positive
        Double depth
) {
}

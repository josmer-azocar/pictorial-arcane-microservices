package com.uneg.pictorialArcane.domain.dto.request;

import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;

public record PaintingRequestDto(
        @NotNull
        String technique,

        @NotNull
        String holder,

        @NotNull
        String style,

        @NotNull
        String framed,

        @Positive
        Double width,

        @Positive
        Double height
) {
}

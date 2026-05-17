package com.uneg.pictorialArcane.domain.dto.request;

import jakarta.validation.constraints.NotNull;

public record PhotographyRequestDto(
        @NotNull
        String printType,

        @NotNull
        String resolution,

        @NotNull
        String color,

        @NotNull
        String serialNumber,

        @NotNull
        String camera
) {
}

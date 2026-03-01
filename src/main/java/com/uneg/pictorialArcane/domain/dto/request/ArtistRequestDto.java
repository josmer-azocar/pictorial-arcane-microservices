package com.uneg.pictorialArcane.domain.dto.request;

import jakarta.validation.constraints.*;

public record ArtistRequestDto(
        @NotNull(message = "name cant be empty")
        String name,

        @NotNull(message = "Last name cant be empty")
        String lastName,

        String nationality,

        @Size(max = 250, message = "Biography must be under 250 characters")
        String biography,

        @NotNull
        @DecimalMax(value = "0.1", message = "commission rate must be between 0.1 and 0.05")
        @DecimalMin(value = "0.05", message = "commission rate must be between 0.1 and 0.05")
        Double commissionRate
) {}

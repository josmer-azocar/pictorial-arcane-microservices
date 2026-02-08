package com.uneg.pictorialArcane.domain.dto.request;

import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;

public record ArtistRequestDto(
        @NotNull(message = "name cant be empty")
        String name,

        @NotNull(message = "Last name cant be empty")
        String lastName,

        @NotNull
        String nationality,

        @Size(max = 120, message = "Biography must be under 120 characters")
        String biography
) {}

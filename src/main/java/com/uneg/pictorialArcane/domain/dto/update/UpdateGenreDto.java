package com.uneg.pictorialArcane.domain.dto.update;

import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;

public record UpdateGenreDto(
        @NotNull(message = "name cant be empty")
        @Size(max = 20, message = "name must be under 15 characters")
        String name,

        @NotNull(message = "description cant be empty")
        @Size(max = 120, message = "description must be under 120 characters")
        String description
) {
}


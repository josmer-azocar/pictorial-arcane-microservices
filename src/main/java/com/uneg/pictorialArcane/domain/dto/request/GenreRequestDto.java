package com.uneg.pictorialArcane.domain.dto.request;

import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;

public record GenreRequestDto(
        @NotNull(message = "name cant be empty")
        @Size(max = 15, message = "name must be under 15 characters")
        String name,

        @NotNull(message = "description cant be empty")
        @Size(max = 120, message = "description must be under 120 characters")
        String description
) {
}


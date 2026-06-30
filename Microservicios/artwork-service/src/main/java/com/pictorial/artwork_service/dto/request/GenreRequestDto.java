package com.pictorial.artwork_service.dto.request;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

public record GenreRequestDto(
        @NotBlank(message = "name cant be blank")
        @Size(max = 15, message = "name must be under 15 characters")
        String name,

        @NotBlank(message = "description cant be blank")
        @Size(max = 120, message = "description must be under 120 characters")
        String description
) {}

package com.pictorial.artwork_service.dto.request;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Positive;

public record SculptureRequestDto(
        @NotBlank(message = "material cant be blank") String material,
        @Positive(message = "weight must be positive") Double weight,
        @Positive(message = "length must be positive") Double length,
        @Positive(message = "width must be positive") Double width,
        @Positive Double depth
) {}

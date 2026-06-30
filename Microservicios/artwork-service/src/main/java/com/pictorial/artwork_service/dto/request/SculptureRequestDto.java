package com.pictorial.artwork_service.dto.request;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;

public record SculptureRequestDto(
        @NotBlank(message = "material cant be blank") String material,
        @NotNull(message = "weight cant be null") @Positive(message = "weight must be positive") Double weight,
        @NotNull(message = "length cant be null") @Positive(message = "length must be positive") Double length,
        @NotNull(message = "width cant be null") @Positive(message = "width must be positive") Double width,
        @NotNull(message = "depth cant be null") @Positive(message = "depth must be positive") Double depth
) {}

package com.pictorial.artwork_service.dto.request;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;

public record CeramicRequestDto(
        @NotBlank(message = "materialType cant be blank") String materialType,
        @NotBlank(message = "technique cant be blank") String technique,
        @NotBlank(message = "finish cant be blank") String finish,
        @NotNull(message = "cookingTemperature cant be null") @Positive(message = "cookingTemperature must be positive") Double cookingTemperature,
        @NotNull(message = "weight cant be null") @Positive(message = "weight must be positive") Double weight,
        @NotNull(message = "width cant be null") @Positive(message = "width must be positive") Double width,
        @NotNull(message = "height cant be null") @Positive(message = "height must be positive") Double height
) {}

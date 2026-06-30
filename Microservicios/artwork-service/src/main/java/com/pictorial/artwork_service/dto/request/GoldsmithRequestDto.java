package com.pictorial.artwork_service.dto.request;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;

public record GoldsmithRequestDto(
        @NotBlank(message = "material cant be blank") String material,
        @NotBlank(message = "preciousStones cant be blank") String preciousStones,
        @NotNull(message = "weight cant be null") @Positive(message = "weight must be positive") Double weight
) {}

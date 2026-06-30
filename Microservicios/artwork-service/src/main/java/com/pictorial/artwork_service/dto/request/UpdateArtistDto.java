package com.pictorial.artwork_service.dto.request;

import jakarta.validation.constraints.DecimalMax;
import jakarta.validation.constraints.DecimalMin;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;

public record UpdateArtistDto(
        @NotBlank(message = "name cant be blank") String name,
        @NotBlank(message = "Last name cant be blank") String lastName,
        @NotBlank(message = "Nationality cant be blank") String nationality,
        @NotBlank(message = "Biography cant be blank") @Size(max = 250, message = "Biography must be under 250 characters") String biography,
        @NotNull(message = "Commission rate cant be null")
        @DecimalMax(value = "0.1", message = "commission rate must be between 0.1 and 0.05")
        @DecimalMin(value = "0.05", message = "commission rate must be between 0.1 and 0.05")
        Double commissionRate
) {}

package com.pictorial.artwork_service.dto.request;

import jakarta.validation.constraints.DecimalMax;
import jakarta.validation.constraints.DecimalMin;
import jakarta.validation.constraints.NotNull;

import java.time.LocalDate;

public record ArtistRequestDto(
        @NotNull(message = "name cant be empty")
        String name,

        @NotNull(message = "Last name cant be empty")
        String lastName,

        String nationality,

        @jakarta.validation.constraints.Size(max = 250, message = "Biography must be under 250 characters")
        String biography,

        @NotNull
        @DecimalMax(value = "0.1", message = "commission rate must be between 0.1 and 0.05")
        @DecimalMin(value = "0.05", message = "commission rate must be between 0.1 and 0.05")
        Double commissionRate,

        @NotNull
        LocalDate birthdate
) {}

package com.pictorial.artwork_service.dto.request;

import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;

public record UpdateArtistDto(
        @NotNull(message = "name cant be empty") String name,
        @NotNull(message = "Last name cant be empty") String lastName,
        @NotNull(message = "Nationality cant be empty") String nationality,
        @NotNull String biography,
        @Positive Double commissionRate
) {}

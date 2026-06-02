package com.pictorial.artwork_service.dto.response;

import java.time.LocalDate;
import java.util.Set;

public record ArtistResponseDto(
        String id,
        String name,
        String lastName,
        String nationality,
        String biography,
        Double commissionRate,
        LocalDate birthdate,
        String imageUrl,
        Set<String> genres
) {}

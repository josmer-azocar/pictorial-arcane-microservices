package com.uneg.pictorialArcane.domain.dto.response;

import java.time.LocalDate;

public record ArtistResponseDto(
        Long idArtist,
        String name,
        String lastName,
        String nationality,
        String biography,
        Double commissionRate,
        LocalDate birthdate,
        String imageUrl
) {
}

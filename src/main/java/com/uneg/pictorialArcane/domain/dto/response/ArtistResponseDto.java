package com.uneg.pictorialArcane.domain.dto.response;

public record ArtistResponseDto(
        Long idArtist,
        String name,
        String lastName,
        String nationality,
        String biography
) {
}

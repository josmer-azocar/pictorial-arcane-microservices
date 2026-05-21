package com.pictorial.artwork_service.dto.response;

public record ContainerCeramicResponseDto(
        ArtWorkResponseDto artworkResponse,
        CeramicResponseDto ceramicResponse
) {}

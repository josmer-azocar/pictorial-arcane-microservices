package com.pictorial.artwork_service.dto.response;

public record ContainerPhotographyResponseDto(
        ArtWorkResponseDto artworkResponse,
        PhotographyResponseDto photographyResponse
) {}

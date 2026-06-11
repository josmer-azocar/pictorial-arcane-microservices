package com.pictorial.artwork_service.dto.response;

public record ContainerPaintingResponseDto(
        ArtWorkResponseDto artworkResponse,
        PaintingResponseDto paintingResponse
) {}

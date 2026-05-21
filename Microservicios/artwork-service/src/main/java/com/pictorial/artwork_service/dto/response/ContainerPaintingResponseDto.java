package com.pictorial.artwork_service.dto.response;

public record ContainerPaintingResponseDto(
        ArtWorkResponseDto artWorkResponse,
        PaintingResponseDto paintingResponse
) {}

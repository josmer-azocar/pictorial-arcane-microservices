package com.pictorial.artwork_service.dto.response;

public record ContainerSculptureResponseDto(
        SculptureResponseDto sculptureResponse,
        ArtWorkResponseDto artworkResponse
) {}

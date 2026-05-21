package com.pictorial.artwork_service.dto.response;

public record ContainerGoldsmithResponseDto(
        ArtWorkResponseDto artworkResponse,
        GoldsmithResponseDto goldsmithResponse
) {}

package com.pictorial.artwork_service.dto.response;

public record SculptureResponseDto(
        String id,
        String material,
        Double weight,
        Double length,
        Double width,
        Double depth
) {}

package com.pictorial.artwork_service.dto.response;

public record PaintingResponseDto(
        String id,
        String technique,
        String holder,
        String style,
        String framed,
        Double width,
        Double height
) {}

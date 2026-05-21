package com.pictorial.artwork_service.dto.response;

public record PhotographyResponseDto(
        String id,
        String printType,
        String resolution,
        String color,
        String serialNumber,
        String camera
) {}

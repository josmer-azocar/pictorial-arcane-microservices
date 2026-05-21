package com.pictorial.artwork_service.dto.response;

public record CeramicResponseDto(
        String id,
        String materialType,
        String technique,
        String finish,
        Double cookingTemperature,
        Double weight,
        Double width,
        Double height
) {}

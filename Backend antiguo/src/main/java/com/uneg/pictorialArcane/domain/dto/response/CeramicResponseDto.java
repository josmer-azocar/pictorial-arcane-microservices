package com.uneg.pictorialArcane.domain.dto.response;

public record CeramicResponseDto(
        String materialType,

        String technique,

        String finish,

        Double cookingTemperature,

        Double weight,

        Double width,

        Double height
) {
}

package com.uneg.pictorialArcane.domain.dto.response;


public record PhotographyResponseDto(
        String printType,

        String resolution,

        String color,

        String serialNumber,

        String camera
) {
}

package com.pictorial.artwork_service.dto.request;

import jakarta.validation.constraints.NotBlank;

public record PhotographyRequestDto(
        @NotBlank(message = "printType cant be blank") String printType,
        @NotBlank(message = "resolution cant be blank") String resolution,
        @NotBlank(message = "color cant be blank") String color,
        @NotBlank(message = "serialNumber cant be blank") String serialNumber,
        @NotBlank(message = "camera cant be blank") String camera
) {}

package com.pictorial.artwork_service.dto.request;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;

public record PaintingRequestDto(
        @NotBlank(message = "technique cant be blank") String technique,
        @NotBlank(message = "holder cant be blank") String holder,
        @NotBlank(message = "style cant be blank") String style,
        @NotBlank(message = "framed cant be blank") String framed,
        @NotNull(message = "width cant be null") @Positive(message = "width must be positive") Double width,
        @NotNull(message = "height cant be null") @Positive(message = "height must be positive") Double height
) {}

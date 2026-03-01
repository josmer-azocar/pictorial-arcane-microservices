package com.uneg.pictorialArcane.domain.dto.request;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

public record SaleRequestDto(

        @NotNull(message = "El ID de la obra es obligatorio")
        Long artworkId,

        @NotBlank(message = "La descripción no puede estar vacía")
        String description,

        @NotBlank(message = "La dirección de envío es obligatoria")
        String shippingAddress
) {
}

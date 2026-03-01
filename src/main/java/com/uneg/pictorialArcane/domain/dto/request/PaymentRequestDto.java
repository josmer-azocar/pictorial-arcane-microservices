package com.uneg.pictorialArcane.domain.dto.request;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;

import java.time.LocalDate;

public record PaymentRequestDto(
        @NotNull(message = "El ID de la venta es obligatorio")
        Long saleId,

        @NotNull(message = "El monto es obligatorio")
        @Positive(message = "El monto debe ser mayor a cero")
        Double amount,

        @NotNull(message = "La fecha de pago es obligatoria")
        LocalDate paymentDate,

        @NotBlank(message = "El nombre del banco es obligatorio")
        String bankName
) {
}

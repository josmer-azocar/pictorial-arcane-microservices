package com.pictorial.audit_service.dto.request;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;
import jakarta.validation.constraints.PositiveOrZero;
import java.time.LocalDate;

public record BillingByMonthRequestDto(
        @NotNull(message = "Sale ID cannot be null")
        Long saleId,

        @NotNull(message = "Sale date cannot be null")
        LocalDate saleDate,

        @NotNull(message = "Admin DNI cannot be null")
        Long adminDni,

        @NotNull(message = "Artwork ID cannot be null")
        Long artworkId,

        @NotNull(message = "Client DNI cannot be null")
        Long clientDni,

        String description,

        @NotNull(message = "Profit amount cannot be null")
        @PositiveOrZero(message = "Profit amount must be positive or zero")
        Double profitAmount,

        @NotNull(message = "Profit percentage cannot be null")
        @PositiveOrZero(message = "Profit percentage must be positive or zero")
        Double profitPercentage,

        @NotNull(message = "Sale price cannot be null")
        @Positive(message = "Sale price must be positive")
        Double salePrice,

        @NotBlank(message = "Sale status cannot be blank")
        String saleStatus,

        String shippingAddress,

        String shippingStatus,

        @NotNull(message = "Tax amount cannot be null")
        @PositiveOrZero(message = "Tax amount must be positive or zero")
        Double taxAmount,

        @NotNull(message = "Total paid cannot be null")
        @PositiveOrZero(message = "Total paid must be positive or zero")
        Double totalPaid
) {}

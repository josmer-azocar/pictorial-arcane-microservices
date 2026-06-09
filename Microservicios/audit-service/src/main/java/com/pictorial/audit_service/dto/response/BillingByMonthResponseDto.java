package com.pictorial.audit_service.dto.response;

import java.time.Instant;
import java.time.LocalDate;

public record BillingByMonthResponseDto(
        String yearMonth,
        LocalDate saleDate,
        Long saleId,
        Long adminDni,
        Long artworkId,
        Long clientDni,
        Instant createdAt,
        String description,
        Instant modifiedAt,
        Double profitAmount,
        Double profitPercentage,
        Double salePrice,
        String saleStatus,
        String shippingAddress,
        String shippingStatus,
        Double taxAmount,
        Double totalPaid
) {}

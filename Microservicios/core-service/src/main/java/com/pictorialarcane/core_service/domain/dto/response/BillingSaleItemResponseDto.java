package com.pictorialarcane.core_service.domain.dto.response;

import java.time.LocalDate;

public record BillingSaleItemResponseDto(
        Long invoiceCode,
        LocalDate date,
        Long artworkId,
        Double artworkPrice,
        Double museumProfitPercentage,
        Double museumProfitAmount,
        Double totalPaid
) {
}


package com.uneg.pictorialArcane.domain.dto.response;

import java.time.LocalDate;

public record BillingSaleItemResponseDto(
        Long invoiceCode,
        LocalDate date,
        Long artworkId,
        String artworkName,
        Double artworkPrice,
        Double museumProfitPercentage,
        Double museumProfitAmount,
        Double totalPaid
) {
}


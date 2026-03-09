package com.uneg.pictorialArcane.domain.dto.response;

import java.time.LocalDate;

public record BillingSaleItemResponseDto(
        Long invoiceCode,
        LocalDate date,
        Double artworkPrice,
        Double museumProfitPercentage,
        Double museumProfitAmount,
        Double totalPaid
) {
}


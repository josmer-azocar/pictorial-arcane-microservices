package com.uneg.pictorialArcane.domain.dto.response;

import com.uneg.pictorialArcane.domain.Enum.SaleStatus;
import com.uneg.pictorialArcane.domain.Enum.ShippingStatus;

import java.time.LocalDate;

public record PurchaseResponseDto(
        Long idSale,
        String artworkTitle,
        LocalDate date,
        String description,
        Double price,
        Double taxAmount,
        Double totalPaid,
        String shippingAddress,
        ShippingStatus shippingStatus,
        SaleStatus saleStatus
) {
}

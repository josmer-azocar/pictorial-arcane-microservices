package com.pictorialarcane.core_service.domain.dto.response;

import com.pictorialarcane.core_service.domain.Enum.SaleStatus;
import com.pictorialarcane.core_service.domain.Enum.ShippingStatus;

import java.time.LocalDate;

public record PurchaseResponseDto(
        Long idSale,
        Long artworkId,
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

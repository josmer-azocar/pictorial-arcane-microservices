package com.pictorialarcane.core_service.domain.dto.response;

import com.pictorialarcane.core_service.domain.Enum.SaleStatus;
import com.pictorialarcane.core_service.domain.Enum.ShippingStatus;

import java.time.LocalDate;

public record SaleResponseDto (
        Long idSale,
        Long artworkId,
        String clientFullName,
        String adminName,
        LocalDate date,
        String description,
        Double price,
        Double profitPercentage,
        Double profitAmount,
        Double taxAmount,
        Double totalPaid,
        String shippingAddress,
        ShippingStatus shippingStatus,
        SaleStatus saleStatus
){
}

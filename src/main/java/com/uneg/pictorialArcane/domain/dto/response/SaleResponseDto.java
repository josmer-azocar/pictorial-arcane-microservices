package com.uneg.pictorialArcane.domain.dto.response;

import com.uneg.pictorialArcane.domain.Enum.SaleStatus;
import com.uneg.pictorialArcane.domain.Enum.ShippingStatus;

import java.time.LocalDate;

public record SaleResponseDto (
        Long idSale,
        String artworkTitle,
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

package com.pictorialarcane.core_service.domain.dto.response;

import java.time.LocalDate;
import java.util.List;

public record BillingSummaryResponseDto(
        LocalDate startDate,
        LocalDate endDate,
        Double totalCollected,
        Double totalMuseumProfit,
        List<BillingSaleItemResponseDto> sales
) {
}


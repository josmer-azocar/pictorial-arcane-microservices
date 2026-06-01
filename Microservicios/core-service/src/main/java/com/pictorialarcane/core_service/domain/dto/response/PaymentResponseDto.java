package com.pictorialarcane.core_service.domain.dto.response;

import java.math.BigDecimal;
import java.time.LocalDate;

public record PaymentResponseDto(
        Long id,
        Double amount,
        LocalDate paymentDate,
        String bankName,
        String reference
) {
}

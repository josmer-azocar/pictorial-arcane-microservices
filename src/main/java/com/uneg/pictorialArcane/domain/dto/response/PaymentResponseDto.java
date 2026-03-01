package com.uneg.pictorialArcane.domain.dto.response;

import java.math.BigDecimal;
import java.time.LocalDate;

public record PaymentResponseDto(
        Long id,
        Double amount,
        LocalDate paymentDate,
        String bankName,
        Long saleId
) {
}

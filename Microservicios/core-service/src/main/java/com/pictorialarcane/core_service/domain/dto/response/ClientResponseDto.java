package com.pictorialarcane.core_service.domain.dto.response;

import java.math.BigInteger;

public record ClientResponseDto(
        Long dniUser,
        BigInteger creditCardNumber,
        Integer postalCode
) {
}

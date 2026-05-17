package com.uneg.pictorialArcane.domain.dto.response;

import java.math.BigInteger;

public record ClientResponseDto(
        Long dniUser,
        BigInteger creditCardNumber,
        Integer postalCode
) {
}

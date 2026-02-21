package com.uneg.pictorialArcane.domain.dto.update;

import jakarta.validation.constraints.Positive;

import java.math.BigInteger;

public record UpdateClientDto(
        @Positive(message = "credit card number must be Positive")
        BigInteger creditCardNumber,

        @Positive(message = "Postal code must be positive")
        Integer postalCode
) {
}

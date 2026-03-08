package com.uneg.pictorialArcane.domain.dto.response;

import com.uneg.pictorialArcane.domain.Enum.MembershipStatus;
import jakarta.validation.constraints.NotNull;
import java.time.LocalDate;
import java.time.LocalDateTime;

public record MembershipResponseDto(
        Long idMembership,
        Long clientId,
        Double amountPaid,
        LocalDateTime paymentDate,
        LocalDate expiryDate,
        MembershipStatus status
) {
}


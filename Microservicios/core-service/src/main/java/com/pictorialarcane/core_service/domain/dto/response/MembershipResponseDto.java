package com.pictorialarcane.core_service.domain.dto.response;

import com.pictorialarcane.core_service.domain.Enum.MembershipStatus;
import jakarta.validation.constraints.NotNull;
import java.time.LocalDate;
import java.time.LocalDateTime;

public record MembershipResponseDto(
        Long idMembership,
        Long clientId,
        Double amountPaid,
        LocalDate paymentDate,
        LocalDate expiryDate,
        MembershipStatus status
) {
}


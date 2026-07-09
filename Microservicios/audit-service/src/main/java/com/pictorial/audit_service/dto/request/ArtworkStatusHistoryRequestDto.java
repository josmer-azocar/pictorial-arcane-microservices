package com.pictorial.audit_service.dto.request;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;
import jakarta.validation.constraints.PositiveOrZero;

public record ArtworkStatusHistoryRequestDto(
        @NotNull(message = "Artwork ID cannot be null")
        @Positive(message = "Artwork ID must be positive")
        Long artworkId,

        @NotBlank(message = "Artwork name cannot be blank")
        String artworkName,

        // 0 = actor "sistema" (liberaciones automáticas del job de expiración de core-service)
        @NotNull(message = "Changed by user ID cannot be null")
        @PositiveOrZero(message = "Changed by user ID must be zero (system) or positive")
        Long changedBy,

        @NotBlank(message = "New status cannot be blank")
        String newStatus,

        String oldStatus,

        String reason
) {}

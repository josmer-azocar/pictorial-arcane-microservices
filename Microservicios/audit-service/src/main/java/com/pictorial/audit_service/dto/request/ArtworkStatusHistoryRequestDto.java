package com.pictorial.audit_service.dto.request;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;

public record ArtworkStatusHistoryRequestDto(
        @NotNull(message = "Artwork ID cannot be null")
        @Positive(message = "Artwork ID must be positive")
        Long artworkId,

        @NotBlank(message = "Artwork name cannot be blank")
        String artworkName,

        @NotNull(message = "Changed by user ID cannot be null")
        @Positive(message = "Changed by user ID must be positive")
        Long changedBy,

        @NotBlank(message = "New status cannot be blank")
        String newStatus,

        String oldStatus,

        String reason
) {}

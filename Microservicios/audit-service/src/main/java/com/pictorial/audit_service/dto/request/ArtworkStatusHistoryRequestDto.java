package com.pictorial.audit_service.dto.request;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

public record ArtworkStatusHistoryRequestDto(
        @NotNull(message = "Artwork ID cannot be null")
        Long artworkId,

        @NotBlank(message = "Artwork name cannot be blank")
        String artworkName,

        @NotNull(message = "Changed by user ID cannot be null")
        Long changedBy,

        @NotBlank(message = "New status cannot be blank")
        String newStatus,

        String oldStatus,

        String reason
) {}

package com.pictorial.audit_service.dto.response;

import java.time.Instant;
import java.util.UUID;

public record ArtworkStatusHistoryResponseDto(
        Long artworkId,
        Instant changedAt,
        UUID changeId,
        String artworkName,
        Long changedBy,
        Instant createdAt,
        String newStatus,
        String oldStatus,
        String reason
) {}

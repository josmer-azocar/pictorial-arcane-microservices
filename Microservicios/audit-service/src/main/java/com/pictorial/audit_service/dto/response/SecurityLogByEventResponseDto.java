package com.pictorial.audit_service.dto.response;

import java.time.Instant;
import java.time.LocalDate;
import java.util.UUID;

public record SecurityLogByEventResponseDto(
        String eventType,
        LocalDate eventDate,
        Instant eventTime,
        UUID eventId,
        Long adminDni,
        Long clientDni,
        String details,
        String ipAddress, // String representation of InetAddress
        String sessionId
) {}

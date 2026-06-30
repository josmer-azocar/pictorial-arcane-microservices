package com.pictorial.audit_service.dto.request;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Positive;

public record SecurityLogByEventRequestDto(
        @NotBlank(message = "Event type cannot be blank")
        String eventType,

        @Positive(message = "Admin DNI must be positive")
        Long adminDni,

        @Positive(message = "Client DNI must be positive")
        Long clientDni,

        String details,

        String ipAddress, // String representation of IP address to be validated/mapped

        String sessionId
) {}

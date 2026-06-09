package com.pictorial.audit_service.dto.request;

import jakarta.validation.constraints.NotBlank;

public record SecurityLogByEventRequestDto(
        @NotBlank(message = "Event type cannot be blank")
        String eventType,

        Long adminDni,

        Long clientDni,

        String details,

        String ipAddress, // String representation of IP address to be validated/mapped

        String sessionId
) {}

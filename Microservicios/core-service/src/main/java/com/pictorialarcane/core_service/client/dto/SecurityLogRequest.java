package com.pictorialarcane.core_service.client.dto;

/**
 * Payload enviado al audit-service para registrar un evento de seguridad
 * (tabla security_log_by_event en Cassandra). Los nombres de campo deben
 * coincidir con SecurityLogByEventRequestDto del audit-service.
 */
public record SecurityLogRequest(
        String eventType,
        Long adminDni,
        Long clientDni,
        String details,
        String ipAddress,
        String sessionId
) {}
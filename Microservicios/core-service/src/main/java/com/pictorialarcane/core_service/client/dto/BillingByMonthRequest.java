package com.pictorialarcane.core_service.client.dto;

import java.time.LocalDate;

/**
 * Payload enviado al audit-service para registrar una venta facturada
 * (colección/tabla billing_by_month en Cassandra). Los nombres de campo deben
 * coincidir con BillingByMonthRequestDto del audit-service.
 */
public record BillingByMonthRequest(
        Long saleId,
        LocalDate saleDate,
        Long adminDni,
        Long artworkId,
        Long clientDni,
        String description,
        Double profitAmount,
        Double profitPercentage,
        Double salePrice,
        String saleStatus,
        String shippingAddress,
        String shippingStatus,
        Double taxAmount,
        Double totalPaid
) {}
package com.pictorial.recommendation_service.mapper;

import com.pictorial.recommendation_service.core.PurchaseHistoryProjection;
import com.pictorial.recommendation_service.dto.response.PurchaseHistoryResponseDto;
import org.springframework.stereotype.Component;

import java.time.ZonedDateTime;
import java.util.List;

/**
 * Convierte la proyección del historial de compras en DTOs de respuesta,
 * serializando la fecha de compra a formato ISO-8601.
 */
@Component
public class PurchaseHistoryMapper {

    public PurchaseHistoryResponseDto toDto(PurchaseHistoryProjection projection) {
        ZonedDateTime fecha = projection.fechaCompra();
        return new PurchaseHistoryResponseDto(
                projection.comprador(),
                projection.obra(),
                projection.artista(),
                projection.genero(),
                fecha != null ? fecha.toString() : null,
                projection.imageUrl()
        );
    }

    public List<PurchaseHistoryResponseDto> toDtoList(List<PurchaseHistoryProjection> projections) {
        return projections.stream().map(this::toDto).toList();
    }
}

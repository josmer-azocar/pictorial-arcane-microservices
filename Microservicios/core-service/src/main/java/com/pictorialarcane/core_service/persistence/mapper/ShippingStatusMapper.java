package com.pictorialarcane.core_service.persistence.mapper;

import com.pictorialarcane.core_service.domain.Enum.ShippingStatus;
import org.mapstruct.Named;

public class ShippingStatusMapper {

    @Named("stringToShippingStatus")
    public static ShippingStatus stringToShippingStatus(String status) {
        if (status == null) return null;

        return switch (status.toUpperCase()) {
            case "PENDING" -> ShippingStatus.PENDING;
            case "SHIPPED" -> ShippingStatus.SHIPPED;
            case "CANCELED" -> ShippingStatus.CANCELED;
            default -> null;
        };
    }

    @Named("shippingStatusToString")
    public static String shippingStatusToString(ShippingStatus status) {
        if (status == null) return null;

        return switch (status) {
            case PENDING -> "PENDING";
            case SHIPPED -> "SHIPPED";
            case CANCELED -> "CANCELED";
        };
    }
}


package com.uneg.pictorialArcane.persistence.mapper;

import com.uneg.pictorialArcane.domain.Enum.SaleStatus;
import org.mapstruct.Named;

public class SaleStatusMapper {

    @Named("stringToSaleStatus")
    public static SaleStatus stringToSaleStatus(String status) {
        if (status == null) return null;

        return switch (status.toUpperCase()) {
            case "APPROVED" -> SaleStatus.APPROVED;
            case "CANCELED" -> SaleStatus.CANCELED;
            case "PENDING" -> SaleStatus.PENDING;
            default -> null;
        };
    }

    @Named("saleStatusToString")
    public static String saleStatusToString(SaleStatus status) {
        if (status == null) return null;

        return switch (status) {
            case APPROVED -> "APPROVED";
            case CANCELED -> "CANCELED";
            case PENDING -> "PENDING";
        };
    }
}


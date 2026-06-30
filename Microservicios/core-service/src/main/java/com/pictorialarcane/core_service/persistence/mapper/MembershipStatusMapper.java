package com.pictorialarcane.core_service.persistence.mapper;

import com.pictorialarcane.core_service.domain.Enum.MembershipStatus;
import org.mapstruct.Named;

public class MembershipStatusMapper {

    @Named("stringToMembershipStatus")
    public static MembershipStatus stringToMembershipStatus(String status) {
        if (status == null) return null;

        return switch (status.toUpperCase()) {
            case "ACTIVE" -> MembershipStatus.ACTIVE;
            case "EXPIRED" -> MembershipStatus.EXPIRED;
            // Se aceptan ambas grafías para soportar datos históricos guardados como "CANCELLED".
            case "CANCELED", "CANCELLED" -> MembershipStatus.CANCELED;
            default -> null;
        };
    }

    @Named("membershipStatusToString")
    public static String membershipStatusToString(MembershipStatus status) {
        if (status == null) return null;

        return switch (status) {
            case ACTIVE -> "ACTIVE";
            case EXPIRED -> "EXPIRED";
            case CANCELED -> "CANCELED";
        };
    }
}


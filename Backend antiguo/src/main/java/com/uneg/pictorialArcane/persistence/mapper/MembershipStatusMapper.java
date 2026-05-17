package com.uneg.pictorialArcane.persistence.mapper;

import com.uneg.pictorialArcane.domain.Enum.MembershipStatus;
import org.mapstruct.Named;

public class MembershipStatusMapper {

    @Named("stringToMembershipStatus")
    public static MembershipStatus stringToMembershipStatus(String status) {
        if (status == null) return null;

        return switch (status.toUpperCase()) {
            case "ACTIVE" -> MembershipStatus.ACTIVE;
            case "EXPIRED" -> MembershipStatus.EXPIRED;
            case "CANCELLED" -> MembershipStatus.CANCELLED;
            default -> null;
        };
    }

    @Named("membershipStatusToString")
    public static String membershipStatusToString(MembershipStatus status) {
        if (status == null) return null;

        return switch (status) {
            case ACTIVE -> "ACTIVE";
            case EXPIRED -> "EXPIRED";
            case CANCELLED -> "CANCELLED";
        };
    }
}


package com.uneg.pictorialArcane.persistence.mapper;

import com.uneg.pictorialArcane.domain.Enum.ArtWorkStatus;
import org.mapstruct.Named;

public class ArtWorkStatusMapper {

    @Named("stringToArtWorkStatus")
    public static ArtWorkStatus stringToArtWorkStatus(String status) {
        if (status == null) return null;

        return switch (status.toUpperCase()) {
            case "AVAILABLE" -> ArtWorkStatus.AVAILABLE;
            case "RESERVED" -> ArtWorkStatus.RESERVED;
            case "SOLD" -> ArtWorkStatus.SOLD;
            default -> null;
        };
    }

    @Named("artWorkStatusToString")
    public static String artWorkStatusToString(ArtWorkStatus status) {
        if (status == null) return null;

        return switch (status) {
            case AVAILABLE -> "AVAILABLE";
            case RESERVED -> "RESERVED";
            case SOLD -> "SOLD";
        };
    }
}


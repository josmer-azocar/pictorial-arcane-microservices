package com.uneg.pictorialArcane.persistence.mapper;

import com.uneg.pictorialArcane.domain.Enum.Gender;
import org.mapstruct.Named;

public class GenderMapper {

    @Named("stringToGender")
    public static Gender stringToGender(String gender){
        if (gender == null) return null;

        return switch (gender.toUpperCase()){
            case "FEMALE" -> Gender.FEMALE;
            case "MALE" -> Gender.MALE;
            case "OTHER" -> Gender.OTHER;
            default -> null;
        };
    }

    @Named("genderToString")
    public static String genderToString(Gender gender){
        if (gender == null) return null;

        return switch (gender){
            case FEMALE -> "FEMALE";
            case MALE -> "MALE";
            case OTHER -> "OTHER";
        };
    }
}

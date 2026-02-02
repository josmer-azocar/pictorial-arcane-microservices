package com.uneg.pictorialArcane.persistence.mapper;

import com.uneg.pictorialArcane.domain.Enum.Role;
import org.mapstruct.Named;

public class RoleMapper {
    @Named("stringToRole")
    public static Role stringToRole(String role){
        if (role == null) return null;

        return switch (role.toUpperCase()){
            case "ADMIN" -> Role.ADMIN;
            case "CLIENT" -> Role.CLIENT;
            default -> null;
        };
    }

    @Named("roleToString")
    public static String roleToString(Role role){
        if (role == null) return null;

        return switch (role){
            case ADMIN -> "ADMIN";
            case CLIENT -> "CLIENT";
        };
    }
}

package com.uneg.pictorialArcane.domain.dto.response;

import com.uneg.pictorialArcane.domain.Enum.Gender;
import com.uneg.pictorialArcane.domain.Enum.Role;

import java.time.LocalDate;

public record UserResponseDto(
         Long dniUser,
         String email,
         String firstName,
         String lastName,
         LocalDate dateOfBirth,
         Gender gender,
         Role role
) {
}


package com.pictorialarcane.core_service.domain.dto.response;

import com.pictorialarcane.core_service.domain.Enum.Gender;
import com.pictorialarcane.core_service.domain.Enum.Role;

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


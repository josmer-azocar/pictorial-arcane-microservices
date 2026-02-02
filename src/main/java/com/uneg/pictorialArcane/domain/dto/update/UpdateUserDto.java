package com.uneg.pictorialArcane.domain.dto.update;

import com.uneg.pictorialArcane.domain.Enum.Gender;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;


import java.time.LocalDate;

public record UpdateUserDto (

        @Size(max = 25, message = "First name cannot exceed 25 characters.")
        String firstName,

        @Size(max = 25, message = "Last name cannot exceed 25 characters.")
        String lastName,

        @NotNull(message = "Date of birth is required.")
        LocalDate dateOfBirth,

        @NotNull
        Gender gender
){
}


package com.pictorialarcane.core_service.domain.dto.update;

import com.pictorialarcane.core_service.domain.Enum.Gender;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import org.springframework.format.annotation.DateTimeFormat;


import java.time.LocalDate;

public record UpdateUserDto (

        @Size(max = 25, message = "First name cannot exceed 25 characters.")
        String firstName,

        @Size(max = 25, message = "Last name cannot exceed 25 characters.")
        String lastName,

        LocalDate dateOfBirth,

        Gender gender
){
}


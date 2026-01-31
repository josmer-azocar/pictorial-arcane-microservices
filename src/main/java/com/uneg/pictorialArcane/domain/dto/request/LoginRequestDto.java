package com.uneg.pictorialArcane.domain.dto.request;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.Builder;

@Builder
public record LoginRequestDto(

        @NotBlank(message = "Email is required.")
        @Size(max = 100, message = "Email cannot exceed 100 characters.")
        String email,

        @NotBlank(message = "Password is required.")
        @Size(min = 8, message = "Password must be at least 8 characters long.")
        String password
) {

}

package com.uneg.pictorialArcane.domain.dto.response;


public record UserProfileResponseDto(
        UserResponseDto user,
        ClientResponseDto client
) {
}


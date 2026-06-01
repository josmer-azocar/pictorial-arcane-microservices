package com.pictorialarcane.core_service.domain.dto.response;


public record UserProfileResponseDto(
        UserResponseDto user,
        ClientResponseDto client
) {
}


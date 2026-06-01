package com.pictorialarcane.core_service.domain.service;

import com.pictorialarcane.core_service.domain.Enum.Role;
import com.pictorialarcane.core_service.domain.dto.response.ClientResponseDto;
import com.pictorialarcane.core_service.domain.dto.response.UserProfileResponseDto;
import com.pictorialarcane.core_service.domain.dto.response.UserResponseDto;
import com.pictorialarcane.core_service.domain.dto.update.UpdateUserDto;
import com.pictorialarcane.core_service.persistence.impl_repository.ClientRepository;
import com.pictorialarcane.core_service.persistence.impl_repository.UserEntityRepository;
import org.springframework.stereotype.Service;

@Service
public class UserService {

    private final UserEntityRepository userEntityRepository;
    private final ClientRepository clientRepository;

    public UserService(UserEntityRepository userEntityRepository, ClientRepository clientRepository) {
        this.userEntityRepository = userEntityRepository;
        this.clientRepository = clientRepository;
    }

    public UserResponseDto updateUser(String email, UpdateUserDto updateUserDto) {
        return userEntityRepository.update(email, updateUserDto);
    }

    public UserProfileResponseDto getAuthenticatedProfile(String email) {
        UserResponseDto user = userEntityRepository.getByEmail(email);

        if (user.role() == Role.ADMIN) {
            return new UserProfileResponseDto(user, null);
        }

        ClientResponseDto client = clientRepository.getClientByEmail(email);
        return new UserProfileResponseDto(user, client);
    }
}

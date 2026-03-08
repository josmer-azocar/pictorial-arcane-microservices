package com.uneg.pictorialArcane.domain.service;

import com.uneg.pictorialArcane.domain.dto.response.UserResponseDto;
import com.uneg.pictorialArcane.domain.dto.update.UpdateUserDto;
import com.uneg.pictorialArcane.persistence.impl_repository.UserEntityRepository;
import org.springframework.stereotype.Service;

@Service
public class UserService {

    private final UserEntityRepository userEntityRepository;

    public UserService(UserEntityRepository userEntityRepository) {
        this.userEntityRepository = userEntityRepository;
    }

    public UserResponseDto updateUser(String email, UpdateUserDto updateUserDto) {
        return userEntityRepository.update(email, updateUserDto);
    }
}


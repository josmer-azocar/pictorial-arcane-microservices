package com.uneg.pictorialArcane.persistence.impl_repository;

import com.uneg.pictorialArcane.domain.dto.response.UserResponseDto;
import com.uneg.pictorialArcane.domain.dto.update.UpdateUserDto;
import com.uneg.pictorialArcane.domain.exception.UserDoesNotExistsException;
import com.uneg.pictorialArcane.persistence.crud_repository.CrudUserRepository;
import com.uneg.pictorialArcane.persistence.entity.UserEntity;
import com.uneg.pictorialArcane.persistence.mapper.UserMapper;
import org.springframework.stereotype.Repository;

@Repository
public class UserEntityRepository {

    private final CrudUserRepository crudUserRepository;
    private final UserMapper userMapper;

    public UserEntityRepository(CrudUserRepository crudUserRepository, UserMapper userMapper) {
        this.crudUserRepository = crudUserRepository;
        this.userMapper = userMapper;
    }

    public UserResponseDto getByEmail(String email) {
        if (this.crudUserRepository.findFirstByEmail(email) == null) {
            throw new UserDoesNotExistsException(email);
        }
        return this.userMapper.toResponseDto(this.crudUserRepository.findByEmail(email).orElse(null));
    }

    public UserResponseDto update(String email, UpdateUserDto updateUserDto) {
        if (this.crudUserRepository.findFirstByEmail(email) == null) {
            throw new UserDoesNotExistsException(email);
        }
        UserEntity userEntity = this.crudUserRepository.findByEmail(email).orElse(null);
        this.userMapper.updateEntityFromDto(updateUserDto, userEntity);

        return this.userMapper.toResponseDto(this.crudUserRepository.save(userEntity));
    }

    public Void deleteByIdUser(Long dniUser) {
        if (this.crudUserRepository.findByDniUser(dniUser) == null) {
            throw new UserDoesNotExistsException(dniUser);
        }
        return this.crudUserRepository.deleteByDniUser(dniUser);
    }

    public UserResponseDto getByIdUser(Long dniUser) {
        if(crudUserRepository.findByDniUser(dniUser) == null){
            throw new UserDoesNotExistsException(dniUser);
        }
        return this.userMapper.toResponseDto(this.crudUserRepository.findByDniUser(dniUser));
    }
}


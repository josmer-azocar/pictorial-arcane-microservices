package com.pictorialarcane.core_service.persistence.mapper;

import com.pictorialarcane.core_service.domain.dto.request.UserRequestDto;
import com.pictorialarcane.core_service.domain.dto.response.UserResponseDto;
import com.pictorialarcane.core_service.domain.dto.update.UpdateUserDto;
import com.pictorialarcane.core_service.persistence.entity.UserEntity;
import org.mapstruct.BeanMapping;
import org.mapstruct.InheritInverseConfiguration;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.MappingTarget;
import org.mapstruct.NullValuePropertyMappingStrategy;

import java.util.List;

@Mapper(componentModel = "spring", uses = {GenderMapper.class, RoleMapper.class})
public interface UserMapper {

    @Mapping(source ="gender", target = "gender", qualifiedByName = "stringToGender")
    @Mapping(source ="role", target = "role", qualifiedByName = "stringToRole")
    UserResponseDto toResponseDto(UserEntity entity);
    List<UserResponseDto> toResponseDto(Iterable<UserEntity> entities);

    @InheritInverseConfiguration
    @Mapping(source ="gender", target = "gender", qualifiedByName = "genderToString")
    @Mapping(source ="role", target = "role", qualifiedByName = "roleToString")
    UserEntity toEntity(UserRequestDto requestDto);

    @BeanMapping(nullValuePropertyMappingStrategy = NullValuePropertyMappingStrategy.IGNORE)
    @Mapping(source ="gender", target = "gender", qualifiedByName = "genderToString")
    void updateEntityFromDto (UpdateUserDto updateUserDto, @MappingTarget UserEntity userEntity);
}

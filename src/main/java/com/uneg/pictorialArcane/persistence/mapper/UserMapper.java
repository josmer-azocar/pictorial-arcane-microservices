package com.uneg.pictorialArcane.persistence.mapper;

import com.uneg.pictorialArcane.domain.dto.request.UserRequestDto;
import com.uneg.pictorialArcane.domain.dto.response.UserResponseDto;
import com.uneg.pictorialArcane.domain.dto.update.UpdateUserDto;
import com.uneg.pictorialArcane.persistence.entity.UserEntity;
import org.mapstruct.InheritInverseConfiguration;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.MappingTarget;

import java.util.List;

@Mapper(componentModel = "spring", uses = {GenderMapper.class})
public interface UserMapper {

    @Mapping(source ="gender", target = "gender", qualifiedByName = "stringToGender")
    UserResponseDto toResponseDto(UserEntity entity);
    List<UserResponseDto> toResponseDto(Iterable<UserEntity> entities);

    @InheritInverseConfiguration
    @Mapping(source ="gender", target = "gender", qualifiedByName = "genderToString")
    UserEntity toEntity(UserRequestDto requestDto);

    void updateEntityFromDto (UpdateUserDto updateUserDto, @MappingTarget UserEntity userEntity);
}


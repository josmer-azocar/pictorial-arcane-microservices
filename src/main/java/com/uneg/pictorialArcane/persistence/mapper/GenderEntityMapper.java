package com.uneg.pictorialArcane.persistence.mapper;

import com.uneg.pictorialArcane.domain.dto.request.GenderRequestDto;
import com.uneg.pictorialArcane.domain.dto.response.GenderResponseDto;
import com.uneg.pictorialArcane.domain.dto.update.UpdateGenderDto;
import com.uneg.pictorialArcane.persistence.entity.GenderEntity;
import org.mapstruct.InheritInverseConfiguration;
import org.mapstruct.Mapper;
import org.mapstruct.MappingTarget;

import java.util.List;

@Mapper(componentModel = "spring")
public interface GenderEntityMapper {
    GenderResponseDto toResponseDto(GenderEntity entity);

    List<GenderResponseDto> toResponseDto(Iterable<GenderEntity> entities);

    @InheritInverseConfiguration
    GenderEntity toEntity(GenderRequestDto requestDto);

    void updateEntityFromDto(UpdateGenderDto updateGenderDto, @MappingTarget GenderEntity genderEntity);
}


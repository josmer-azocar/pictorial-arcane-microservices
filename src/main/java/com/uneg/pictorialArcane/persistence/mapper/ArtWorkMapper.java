package com.uneg.pictorialArcane.persistence.mapper;

import com.uneg.pictorialArcane.domain.dto.request.ArtWorkRequestDto;
import com.uneg.pictorialArcane.domain.dto.response.ArtWorkResponseDto;
import com.uneg.pictorialArcane.domain.dto.update.UpdateArtWorkDto;
import com.uneg.pictorialArcane.persistence.entity.ArtWorkEntity;
import org.mapstruct.InheritInverseConfiguration;
import org.mapstruct.Mapper;
import org.mapstruct.MappingTarget;


import java.util.List;

@Mapper(componentModel = "spring")
public interface ArtWorkMapper {


    ArtWorkResponseDto toResponseDto(ArtWorkEntity entity);
    List<ArtWorkResponseDto> toResponseDto(Iterable<ArtWorkEntity> entities);

    @InheritInverseConfiguration
    ArtWorkEntity toEntity(ArtWorkRequestDto requestDto);

    void updateEntityFromDto (UpdateArtWorkDto updateArtWorkDto, @MappingTarget ArtWorkEntity artWorkEntity);
}

package com.uneg.pictorialArcane.persistence.mapper;

import com.uneg.pictorialArcane.domain.dto.request.GenreRequestDto;
import com.uneg.pictorialArcane.domain.dto.response.GenreResponseDto;
import com.uneg.pictorialArcane.domain.dto.update.UpdateGenreDto;
import com.uneg.pictorialArcane.persistence.entity.GenreEntity;
import org.mapstruct.InheritInverseConfiguration;
import org.mapstruct.Mapper;
import org.mapstruct.MappingTarget;

import java.util.List;

@Mapper(componentModel = "spring")
public interface GenreEntityMapper {
    GenreResponseDto toResponseDto(GenreEntity entity);

    List<GenreResponseDto> toResponseDto(Iterable<GenreEntity> entities);

    @InheritInverseConfiguration
    GenreEntity toEntity(GenreRequestDto requestDto);

    void updateEntityFromDto(UpdateGenreDto updateGenreDto, @MappingTarget GenreEntity genreEntity);
}

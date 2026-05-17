package com.uneg.pictorialArcane.persistence.mapper;

import com.uneg.pictorialArcane.domain.dto.response.ArtistResponseDto;
import com.uneg.pictorialArcane.persistence.entity.ArtistEntity;
import org.mapstruct.Mapper;

import java.util.List;

@Mapper(componentModel = "spring")
public interface SimpleArtistMapper {
    ArtistResponseDto toResponseDto(ArtistEntity entity);

    List<ArtistResponseDto> toResponseDto(Iterable<ArtistEntity> entities);
}


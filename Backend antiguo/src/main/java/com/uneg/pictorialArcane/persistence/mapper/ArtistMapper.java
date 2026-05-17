package com.uneg.pictorialArcane.persistence.mapper;

import com.uneg.pictorialArcane.domain.dto.request.ArtistRequestDto;
import com.uneg.pictorialArcane.domain.dto.response.ArtistResponseDto;
import com.uneg.pictorialArcane.domain.dto.update.UpdateArtistDto;
import com.uneg.pictorialArcane.persistence.entity.ArtistEntity;
import org.mapstruct.InheritInverseConfiguration;
import org.mapstruct.Mapper;
import org.mapstruct.MappingTarget;

import java.util.List;

@Mapper(componentModel = "spring")
public interface ArtistMapper {
    ArtistResponseDto toResponseDto(ArtistEntity entity);

    List<ArtistResponseDto> toResponseDto(Iterable<ArtistEntity> entities);

    @InheritInverseConfiguration
    ArtistEntity toEntity(ArtistRequestDto requestDto);

    void updateEntityFromDto (UpdateArtistDto updateArtistDto, @MappingTarget ArtistEntity artistEntity);
}

package com.uneg.pictorialArcane.persistence.mapper;

import com.uneg.pictorialArcane.domain.dto.request.ArtWorkRequestDto;
import com.uneg.pictorialArcane.domain.dto.response.ArtWork2ResponseDto;
import com.uneg.pictorialArcane.domain.dto.response.ArtWorkResponseDto;
import com.uneg.pictorialArcane.domain.dto.update.UpdateArtWorkDto;
import com.uneg.pictorialArcane.persistence.entity.ArtWorkEntity;
import org.mapstruct.*;

import java.util.List;

@Mapper(componentModel = "spring", uses = {ArtWorkStatusMapper.class})
public interface ArtWorkMapper {

    @Mapping(source = "artist.idArtist", target = "idArtist")
    @Mapping(source = "genre.idGenre", target = "idGenre")
    @Mapping(source = "status", target = "status", qualifiedByName = "stringToArtWorkStatus")
    ArtWorkResponseDto toResponseDto(ArtWorkEntity entity);
    List<ArtWorkResponseDto> toResponseDto(Iterable<ArtWorkEntity> entities);


    @InheritInverseConfiguration
    @Mapping(target = "artist.idArtist", source = "idArtist")
    @Mapping(target = "genre.idGenre", source = "idGenre")
    @Mapping(source = "status", target = "status", qualifiedByName = "artWorkStatusToString")
    ArtWorkEntity toEntity(ArtWorkRequestDto requestDto);

    void updateEntityFromDto (UpdateArtWorkDto updateArtWorkDto, @MappingTarget ArtWorkEntity artWorkEntity);
}

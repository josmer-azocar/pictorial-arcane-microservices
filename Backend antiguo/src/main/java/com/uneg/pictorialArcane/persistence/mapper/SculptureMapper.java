package com.uneg.pictorialArcane.persistence.mapper;

import com.uneg.pictorialArcane.domain.dto.request.ContainerSculptureRequestDto;
import com.uneg.pictorialArcane.domain.dto.response.ArtWorkResponseDto;
import com.uneg.pictorialArcane.domain.dto.response.ContainerSculptureResponseDto;
import com.uneg.pictorialArcane.domain.dto.response.SculptureResponseDto;
import com.uneg.pictorialArcane.persistence.entity.SculptureEntity;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;

@Mapper(componentModel = "spring")//componentModel para inyectar en otras clases
public interface SculptureMapper {

    @Mapping(source = "artWorkRequest.name", target = "name")
    @Mapping(source = "artWorkRequest.status", target = "status")
    @Mapping(source = "artWorkRequest.price", target = "price")
    @Mapping(source = "artWorkRequest.idArtist", target = "artist.idArtist")
    @Mapping(source = "artWorkRequest.idGenre", target = "genre.idGenre")
    @Mapping(source = "sculptureRequest.material", target = "material")
    @Mapping(source = "sculptureRequest.weight", target = "weight")
    @Mapping(source = "sculptureRequest.length", target = "length")
    @Mapping(source = "sculptureRequest.width", target = "width")
    @Mapping(source = "sculptureRequest.depth", target = "depth")
    SculptureEntity toEntity(ContainerSculptureRequestDto request);

    @Mapping(source ="idArtWork", target ="idArtWork")
    @Mapping(source = "price", target = "price")
    @Mapping(source = "artist.idArtist", target = "idArtist")
    @Mapping(source = "genre.idGenre", target = "idGenre")
    ArtWorkResponseDto toArtWorkResponseDto(SculptureEntity entity);

    SculptureResponseDto toSculptureResponseDto(SculptureEntity entity);

    default ContainerSculptureResponseDto toContainerResponseDto(SculptureEntity entity){
        if(entity == null)return null;
        return new ContainerSculptureResponseDto(toSculptureResponseDto(entity), toArtWorkResponseDto(entity));
    }

}

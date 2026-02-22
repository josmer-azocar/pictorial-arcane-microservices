package com.uneg.pictorialArcane.persistence.mapper;

import com.uneg.pictorialArcane.domain.dto.request.ContainerPaintingRequestDto;
import com.uneg.pictorialArcane.domain.dto.response.ArtWorkResponseDto;
import com.uneg.pictorialArcane.domain.dto.response.ContainerPaintingResponseDto;
import com.uneg.pictorialArcane.domain.dto.response.PaintingResponseDto;
import com.uneg.pictorialArcane.persistence.entity.PaintingEntity;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;

@Mapper(componentModel = "spring")
public interface PaintingMapper {

    //mapeo de container a entidad
    @Mapping(source = "artWorkRequest.name", target = "name")
    @Mapping(source = "artWorkRequest.status", target = "status")
    @Mapping(source = "artWorkRequest.prize", target = "prize")
    @Mapping(source = "artWorkRequest.idArtist", target = "artist.idArtist")
    @Mapping(source = "artWorkRequest.idGender", target = "gender.idGender")
    @Mapping(source = "paintingRequest.technique", target = "technique")
    @Mapping(source = "paintingRequest.holder", target = "holder")
    @Mapping(source = "paintingRequest.style", target = "style")
    @Mapping(source = "paintingRequest.framed", target = "framed")
    @Mapping(source = "paintingRequest.width", target = "width")
    @Mapping(source = "paintingRequest.height", target = "height")
    PaintingEntity toEntity(ContainerPaintingRequestDto request);

    //convertir la entidad en un response
    @Mapping(source = "idArtWork", target = "idArtWork")
    @Mapping(source = "prize", target = "prize") // Mapeo de price (Entity) a prize (Dto)
    @Mapping(source = "artist.idArtist", target = "idArtist")
    @Mapping(source = "gender.idGender", target = "idGender")
    ArtWorkResponseDto toArtWorkResponseDto(PaintingEntity entity);

    PaintingResponseDto toPaintingResponseDto(PaintingEntity entity);

    //para evitar el error no write accessor se usa default para crear el contenedor
    default ContainerPaintingResponseDto toContainerResponseDto(PaintingEntity entity) {
        if (entity == null) return null;
        return new ContainerPaintingResponseDto(toArtWorkResponseDto(entity), toPaintingResponseDto(entity));
    }
}

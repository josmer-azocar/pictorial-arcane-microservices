package com.uneg.pictorialArcane.persistence.mapper;

import com.uneg.pictorialArcane.domain.dto.request.ContainerPhotographyRequestDto;
import com.uneg.pictorialArcane.domain.dto.response.*;
import com.uneg.pictorialArcane.persistence.entity.PhotographyEntity;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;

@Mapper(componentModel = "spring")
public interface PhotographyMapper {

    @Mapping(source = "artWorkRequest.name", target = "name")
    @Mapping(source = "artWorkRequest.status", target = "status")
    @Mapping(source = "artWorkRequest.price", target = "price")
    @Mapping(source = "artWorkRequest.idArtist", target = "artist.idArtist")
    @Mapping(source = "artWorkRequest.idGender", target = "gender.idGender")
    @Mapping(source = "photographyRequest.printType", target = "printType")
    @Mapping(source = "photographyRequest.resolution", target = "resolution")
    @Mapping(source = "photographyRequest.color", target = "color")
    @Mapping(source = "photographyRequest.serialNumber", target = "serialNumber")
    @Mapping(source = "photographyRequest.camera", target = "camera")
    PhotographyEntity toEntity(ContainerPhotographyRequestDto request);

    @Mapping(source = "idArtWork", target = "idArtWork")
    @Mapping(source = "price", target = "price")
    @Mapping(source = "artist.idArtist", target = "idArtist")
    @Mapping(source = "gender.idGender", target = "idGender")
    ArtWorkResponseDto toArtWorkResponseDto(PhotographyEntity entity);

    PhotographyResponseDto toPhotographyResponseDto(PhotographyEntity entity);

    default ContainerPhotographyResponseDto toContainerResponseDto(PhotographyEntity entity) {
        if (entity == null) return null;
        return new ContainerPhotographyResponseDto(toArtWorkResponseDto(entity), toPhotographyResponseDto(entity));
    }

}

package com.uneg.pictorialArcane.persistence.mapper;

import com.uneg.pictorialArcane.domain.dto.request.ContainerCeramicRequestDto;
import com.uneg.pictorialArcane.domain.dto.response.*;
import com.uneg.pictorialArcane.persistence.entity.CeramicEntity;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;

@Mapper(componentModel = "spring")
public interface CeramicMapper {

    @Mapping(source = "artWorkRequest.name", target = "name")
    @Mapping(source = "artWorkRequest.status", target = "status")
    @Mapping(source = "artWorkRequest.price", target = "price")
    @Mapping(source = "artWorkRequest.idArtist", target = "artist.idArtist")
    @Mapping(source = "artWorkRequest.idGender", target = "gender.idGender")
    @Mapping(source = "ceramicRequest.materialType", target = "materialType")
    @Mapping(source = "ceramicRequest.technique", target = "technique")
    @Mapping(source = "ceramicRequest.finish", target = "finish")
    @Mapping(source = "ceramicRequest.cookingTemperature", target = "cookingTemperature")
    @Mapping(source = "ceramicRequest.weight", target = "weight")
    @Mapping(source = "ceramicRequest.width", target = "width")
    @Mapping(source = "ceramicRequest.height", target = "height")
    CeramicEntity toEntity(ContainerCeramicRequestDto request);

    @Mapping(source ="idArtWork", target ="idArtWork")
    @Mapping(source = "price", target = "price")
    @Mapping(source = "artist.idArtist", target = "idArtist")
    @Mapping(source = "gender.idGender", target = "idGender")
    ArtWorkResponseDto toArtWorkResponseDto(CeramicEntity entity);

    CeramicResponseDto toCeramicResponseDto(CeramicEntity entity);

    default ContainerCeramicResponseDto toContainerResponseDto(CeramicEntity entity){
        if(entity == null)return null;
        return new ContainerCeramicResponseDto(toArtWorkResponseDto(entity), toCeramicResponseDto(entity));
    }

}

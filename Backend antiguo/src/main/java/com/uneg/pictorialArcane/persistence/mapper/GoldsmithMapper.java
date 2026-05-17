package com.uneg.pictorialArcane.persistence.mapper;

import com.uneg.pictorialArcane.domain.dto.request.ContainerGoldsmithRequestDto;
import com.uneg.pictorialArcane.domain.dto.response.*;
import com.uneg.pictorialArcane.persistence.entity.GoldsmithEntity;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;

@Mapper(componentModel = "spring")
public interface GoldsmithMapper {

    @Mapping(source = "artWorkRequest.name", target = "name")
    @Mapping(source = "artWorkRequest.status", target = "status")
    @Mapping(source = "artWorkRequest.price", target = "price")
    @Mapping(source = "artWorkRequest.idArtist", target = "artist.idArtist")
    @Mapping(source = "artWorkRequest.idGenre", target = "genre.idGenre")
    @Mapping(source = "goldsmithRequest.material", target = "material")
    @Mapping(source = "goldsmithRequest.preciousStones", target = "preciousStones")
    @Mapping(source = "goldsmithRequest.weight", target = "weight")
    GoldsmithEntity toEntity(ContainerGoldsmithRequestDto request);

    @Mapping(source ="idArtWork", target ="idArtWork")
    @Mapping(source = "price", target = "price")
    @Mapping(source = "artist.idArtist", target = "idArtist")
    @Mapping(source = "genre.idGenre", target = "idGenre")
    ArtWorkResponseDto toArtWorkResponseDto(GoldsmithEntity entity);

    GoldsmithResponseDto toGoldsmithResponseDto(GoldsmithEntity entity);

    default ContainerGoldsmithResponseDto toContainerResponseDto(GoldsmithEntity entity){
        if(entity == null)return null;
        return new ContainerGoldsmithResponseDto(toArtWorkResponseDto(entity), toGoldsmithResponseDto(entity));
    }

}

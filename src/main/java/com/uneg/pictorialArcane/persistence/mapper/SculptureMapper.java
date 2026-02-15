package com.uneg.pictorialArcane.persistence.mapper;

import com.uneg.pictorialArcane.domain.dto.request.SculptureRequestDto;
import com.uneg.pictorialArcane.domain.dto.response.SculptureResponseDto;
import com.uneg.pictorialArcane.persistence.entity.SculptureEntity;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;

import java.util.List;

@Mapper(componentModel = "spring") //componente para inyectar en otras clases
public interface SculptureMapper {
    @Mapping(target = "idArtWork", source = "artWork.idArtWork") //saca el id de artwork para usarlo en el dto
    SculptureResponseDto toResponseDto (SculptureEntity entity);

    @Mapping(target = "artWork", ignore = true) //ignora el artwork
    SculptureEntity toEntity(SculptureRequestDto request);

    List<SculptureResponseDto> toResponseDtoList(List<SculptureEntity> entities);
}

package com.uneg.pictorialArcane.persistence.mapper;

import com.uneg.pictorialArcane.domain.dto.response.ClientResponseDto;
import com.uneg.pictorialArcane.domain.dto.update.UpdateClientDto;
import com.uneg.pictorialArcane.persistence.entity.ClientEntity;
import org.mapstruct.Mapper;
import org.mapstruct.MappingTarget;

import java.util.List;

@Mapper(componentModel = "spring")
public interface ClientMappper{

    ClientResponseDto toResponseDto(ClientEntity entity);
    List<ClientResponseDto> toResponseDto(Iterable<ClientEntity> entities);

    void updateEntityFromDto (UpdateClientDto updateClientDto, @MappingTarget ClientEntity clientEntity);
}

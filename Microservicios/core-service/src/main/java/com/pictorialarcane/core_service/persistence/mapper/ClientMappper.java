package com.pictorialarcane.core_service.persistence.mapper;

import com.pictorialarcane.core_service.domain.dto.response.ClientResponseDto;
import com.pictorialarcane.core_service.domain.dto.update.UpdateClientDto;
import com.pictorialarcane.core_service.persistence.entity.ClientEntity;
import org.mapstruct.Mapper;
import org.mapstruct.MappingTarget;

import java.util.List;

@Mapper(componentModel = "spring")
public interface ClientMappper{

    ClientResponseDto toResponseDto(ClientEntity entity);
    List<ClientResponseDto> toResponseDto(Iterable<ClientEntity> entities);

    void updateEntityFromDto (UpdateClientDto updateClientDto, @MappingTarget ClientEntity clientEntity);
}

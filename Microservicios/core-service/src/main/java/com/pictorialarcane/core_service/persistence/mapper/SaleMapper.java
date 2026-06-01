package com.pictorialarcane.core_service.persistence.mapper;

import com.pictorialarcane.core_service.domain.dto.request.SaleRequestDto;
import com.pictorialarcane.core_service.domain.dto.response.SaleResponseDto;
import com.pictorialarcane.core_service.persistence.entity.SaleEntity;
import org.mapstruct.InheritInverseConfiguration;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;

import java.util.List;

@Mapper(componentModel = "spring", uses = {ShippingStatusMapper.class, SaleStatusMapper.class})
public interface SaleMapper {

    @Mapping(source = "idArtwork", target = "artworkId")
    @Mapping(source = "client.fullName", target = "clientFullName")
    @Mapping(source = "admin.fullName", target = "adminName")
    @Mapping(source = "shippingStatus", target = "shippingStatus", qualifiedByName = "stringToShippingStatus")
    @Mapping(source = "saleStatus", target = "saleStatus", qualifiedByName = "stringToSaleStatus")
    SaleResponseDto toResponseDto(SaleEntity entity);

    List<SaleResponseDto> toResponseDto(Iterable<SaleEntity> entities);

    @InheritInverseConfiguration
    @Mapping(target = "idArtwork", source = "artworkId")
    SaleEntity toEntity(SaleRequestDto requestDto);
}


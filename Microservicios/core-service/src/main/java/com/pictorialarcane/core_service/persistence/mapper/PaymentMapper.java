package com.pictorialarcane.core_service.persistence.mapper;

import com.pictorialarcane.core_service.domain.dto.request.PaymentRequestDto;
import com.pictorialarcane.core_service.domain.dto.response.PaymentResponseDto;
import com.pictorialarcane.core_service.persistence.entity.PaymentEntity;
import org.mapstruct.InheritInverseConfiguration;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;

import java.util.List;

@Mapper(componentModel = "spring")
public interface PaymentMapper {

    PaymentResponseDto toResponseDto(PaymentEntity entity);

    List<PaymentResponseDto> toResponseDto(Iterable<PaymentEntity> entities);

    @InheritInverseConfiguration
    PaymentEntity toEntity(PaymentRequestDto requestDto);
}


package com.uneg.pictorialArcane.persistence.mapper;

import com.uneg.pictorialArcane.domain.dto.request.PaymentRequestDto;
import com.uneg.pictorialArcane.domain.dto.response.PaymentResponseDto;
import com.uneg.pictorialArcane.persistence.entity.PaymentEntity;
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


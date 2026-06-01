package com.pictorialarcane.core_service.persistence.mapper;

import com.pictorialarcane.core_service.domain.dto.response.MembershipResponseDto;
import com.pictorialarcane.core_service.persistence.entity.MembershipEntity;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;

import java.util.List;

@Mapper(componentModel = "spring", uses = {MembershipStatusMapper.class})
public interface MembershipMapper {

    @Mapping(source = "client.dniUser", target = "clientId")
    @Mapping(source = "status", target = "status", qualifiedByName = "stringToMembershipStatus")
    MembershipResponseDto toResponseDto(MembershipEntity entity);

    List<MembershipResponseDto> toResponseDto(Iterable<MembershipEntity> entities);
}


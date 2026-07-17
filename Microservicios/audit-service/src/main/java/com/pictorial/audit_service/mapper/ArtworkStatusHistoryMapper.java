package com.pictorial.audit_service.mapper;

import com.pictorial.audit_service.dto.request.ArtworkStatusHistoryRequestDto;
import com.pictorial.audit_service.dto.response.ArtworkStatusHistoryResponseDto;
import com.pictorial.audit_service.persistence.tables.ArtworkStatusHistoryTable;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.ReportingPolicy;

import java.util.List;

@Mapper(componentModel = "spring", unmappedTargetPolicy = ReportingPolicy.IGNORE)
public interface ArtworkStatusHistoryMapper {

    @Mapping(source = "key.artworkId", target = "artworkId")
    @Mapping(source = "key.changedAt", target = "changedAt")
    @Mapping(source = "key.changeId", target = "changeId")
    ArtworkStatusHistoryResponseDto toResponseDto(ArtworkStatusHistoryTable table);

    List<ArtworkStatusHistoryResponseDto> toResponseDtoList(List<ArtworkStatusHistoryTable> tables);

    @Mapping(source = "artworkId", target = "key.artworkId")
    @Mapping(target = "key.changedAt", expression = "java(java.time.Instant.now())")
    @Mapping(target = "key.changeId", expression = "java(com.datastax.oss.driver.api.core.uuid.Uuids.timeBased())")
    @Mapping(target = "createdAt", expression = "java(java.time.Instant.now())")
    ArtworkStatusHistoryTable toTable(ArtworkStatusHistoryRequestDto dto);
}

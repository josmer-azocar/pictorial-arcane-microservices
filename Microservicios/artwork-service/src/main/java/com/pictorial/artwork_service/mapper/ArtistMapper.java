package com.pictorial.artwork_service.mapper;

import com.pictorial.artwork_service.document.ArtistDocument;
import com.pictorial.artwork_service.dto.request.ArtistRequestDto;
import com.pictorial.artwork_service.dto.request.UpdateArtistDto;
import com.pictorial.artwork_service.dto.response.ArtistResponseDto;
import org.mapstruct.Mapper;
import org.mapstruct.MappingTarget;
import org.mapstruct.ReportingPolicy;

@Mapper(componentModel = "spring", unmappedTargetPolicy = ReportingPolicy.IGNORE)
public interface ArtistMapper {

    ArtistResponseDto toResponseDto(ArtistDocument document);

    ArtistDocument toDocument(ArtistRequestDto dto);

    void updateDocumentFromDto(UpdateArtistDto dto, @MappingTarget ArtistDocument document);
}

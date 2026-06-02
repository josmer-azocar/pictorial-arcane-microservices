package com.pictorial.artwork_service.mapper;

import com.pictorial.artwork_service.document.GenreDocument;
import com.pictorial.artwork_service.dto.request.GenreRequestDto;
import com.pictorial.artwork_service.dto.request.UpdateGenreDto;
import com.pictorial.artwork_service.dto.response.GenreResponseDto;
import org.mapstruct.InheritInverseConfiguration;
import org.mapstruct.Mapper;
import org.mapstruct.MappingTarget;
import org.mapstruct.ReportingPolicy;

import java.util.List;

@Mapper(componentModel = "spring", unmappedTargetPolicy = ReportingPolicy.IGNORE)
public interface GenreMapper {

    GenreResponseDto toResponseDto(GenreDocument document);
    List<GenreResponseDto> toResponseDto(Iterable<GenreDocument> documents);

    @InheritInverseConfiguration
    GenreDocument toDocument(GenreRequestDto dto);

    void updateDocumentFromDto(UpdateGenreDto dto, @MappingTarget GenreDocument document);
}

package com.pictorial.artwork_service.mapper;

import com.pictorial.artwork_service.document.ArtWorkDocument;
import com.pictorial.artwork_service.document.ArtistDocument;
import com.pictorial.artwork_service.dto.request.ArtistRequestDto;
import com.pictorial.artwork_service.dto.request.UpdateArtistDto;
import com.pictorial.artwork_service.dto.response.ArtWorkResponseDto;
import com.pictorial.artwork_service.dto.response.ArtistResponseDto;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.MappingTarget;
import org.mapstruct.ReportingPolicy;
import org.mapstruct.Named;
import com.pictorial.artwork_service.document.GenreDocument;

import java.util.List;
import java.util.Optional;
import java.util.Set;
import java.util.stream.Collectors;

@Mapper(componentModel = "spring", unmappedTargetPolicy = ReportingPolicy.IGNORE)
public interface ArtistMapper {

    @Mapping(target = "genres", source = "genres", qualifiedByName = "mapGenresToNames")
    ArtistResponseDto toResponseDto(ArtistDocument document);
    List<ArtistResponseDto> toResponseDto(Iterable<ArtistDocument> documents);

    ArtistDocument toDocument(ArtistRequestDto dto);

    void updateDocumentFromDto(UpdateArtistDto dto, @MappingTarget ArtistDocument document);

    @Named("mapGenresToNames")
    default Set<String> mapGenresToNames(Set<GenreDocument> genres) {
        if (genres == null) {
            return java.util.Collections.emptySet();
        }
        return genres.stream()
                .map(GenreDocument::getName)
                .collect(Collectors.toSet());
    }
}

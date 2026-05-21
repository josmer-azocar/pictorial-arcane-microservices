package com.pictorial.artwork_service.mapper;

import com.pictorial.artwork_service.document.*;
import com.pictorial.artwork_service.dto.request.*;
import com.pictorial.artwork_service.dto.response.*;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.MappingTarget;
import org.mapstruct.ReportingPolicy;

@Mapper(componentModel = "spring", unmappedTargetPolicy = ReportingPolicy.IGNORE)
public interface ArtWorkMapper {

    ArtWorkResponseDto toResponseDto(ArtWorkDocument document);

    ArtWorkDocument toDocument(ArtWorkRequestDto dto);

    void updateDocumentFromDto(UpdateArtWorkDto dto, @MappingTarget ArtWorkDocument document);

    PaintingResponseDto toPaintingResponse(PaintingDocument document);
    SculptureResponseDto toSculptureResponse(SculptureDocument document);
    CeramicResponseDto toCeramicResponse(CeramicDocument document);
    PhotographyResponseDto toPhotographyResponse(PhotographyDocument document);
    GoldsmithResponseDto toGoldsmithResponse(GoldsmithDocument document);

    @Mapping(target = "artWorkResponse", source = "artwork")
    @Mapping(target = "paintingResponse", source = "painting")
    ContainerPaintingResponseDto toContainerPaintingResponse(ArtWorkResponseDto artwork, PaintingResponseDto painting);

    @Mapping(target = "sculptureResponse", source = "sculpture")
    @Mapping(target = "artworkResponse", source = "artwork")
    ContainerSculptureResponseDto toContainerSculptureResponse(SculptureResponseDto sculpture, ArtWorkResponseDto artwork);

    @Mapping(target = "artworkResponse", source = "artwork")
    @Mapping(target = "ceramicResponse", source = "ceramic")
    ContainerCeramicResponseDto toContainerCeramicResponse(ArtWorkResponseDto artwork, CeramicResponseDto ceramic);

    @Mapping(target = "artworkResponse", source = "artwork")
    @Mapping(target = "photographyResponse", source = "photography")
    ContainerPhotographyResponseDto toContainerPhotographyResponse(ArtWorkResponseDto artwork, PhotographyResponseDto photography);

    @Mapping(target = "artworkResponse", source = "artwork")
    @Mapping(target = "goldsmithResponse", source = "goldsmith")
    ContainerGoldsmithResponseDto toContainerGoldsmithResponse(ArtWorkResponseDto artwork, GoldsmithResponseDto goldsmith);
}

package com.pictorial.artwork_service.mapper;

import com.pictorial.artwork_service.document.*;
import com.pictorial.artwork_service.dto.request.*;
import com.pictorial.artwork_service.dto.response.*;
import org.mapstruct.*;

import java.util.List;

@Mapper(componentModel = "spring",
        unmappedTargetPolicy = ReportingPolicy.IGNORE,
        uses = {ArtWorkStatusMapper.class})
public interface ArtWorkMapper {

    @Mapping(source = "status", target = "status", qualifiedByName = "stringToArtWorkStatus")
    ArtWorkResponseDto toResponseDto(ArtWorkDocument document);
    List<ArtWorkResponseDto> toResponseDto(Iterable<ArtWorkDocument> documents);

    @InheritInverseConfiguration
    @Mapping(source = "status", target = "status", qualifiedByName = "artWorkStatusToString")
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

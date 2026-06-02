package com.pictorial.artwork_service.service;

import com.pictorial.artwork_service.document.*;
import com.pictorial.artwork_service.dto.request.*;
import com.pictorial.artwork_service.dto.response.*;
import com.pictorial.artwork_service.exception.ResourceNotFoundException;
import com.pictorial.artwork_service.mapper.ArtWorkMapper;
import com.pictorial.artwork_service.repository.ArtistRepository;
import com.pictorial.artwork_service.repository.ArtWorkRepository;
import com.pictorial.artwork_service.repository.GenreRepository;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Sort;
import org.springframework.data.mongodb.core.MongoTemplate;
import org.springframework.data.mongodb.core.query.Criteria;
import org.springframework.data.mongodb.core.query.Query;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Service
public class ArtWorkService {

    private final ArtWorkRepository artWorkRepository;
    private final ArtistRepository artistRepository;
    private final GenreRepository genreRepository;
    private final ArtWorkMapper artWorkMapper;
    private final MongoTemplate mongoTemplate;

    public ArtWorkService(ArtWorkRepository artWorkRepository,
                          ArtistRepository artistRepository,
                          GenreRepository genreRepository,
                          ArtWorkMapper artWorkMapper,
                          MongoTemplate mongoTemplate) {
        this.artWorkRepository = artWorkRepository;
        this.artistRepository = artistRepository;
        this.genreRepository = genreRepository;
        this.artWorkMapper = artWorkMapper;
        this.mongoTemplate = mongoTemplate;
    }

    public ArtWorkResponseDto create(ArtWorkRequestDto dto) {
        ArtWorkDocument document = buildBaseArtwork(dto);
        return artWorkMapper.toResponseDto(artWorkRepository.save(document));
    }

    public List<ArtWorkResponseDto> getAll() {
        return artWorkMapper.toResponseDto(artWorkRepository.findAll());
    }

    public ArtWorkResponseDto getById(String id) {
        ArtWorkDocument document = artWorkRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("artwork", "Artwork not found"));
        return artWorkMapper.toResponseDto(document);
    }

    public ArtWorkResponseDto update(String id, UpdateArtWorkDto dto) {
        ArtWorkDocument document = artWorkRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("artwork", "Artwork not found"));
        artWorkMapper.updateDocumentFromDto(dto, document);
        document.setModifiedAt(LocalDateTime.now());
        return artWorkMapper.toResponseDto(artWorkRepository.save(document));
    }

    public void delete(String id) {
        if (!artWorkRepository.existsById(id)) {
            throw new ResourceNotFoundException("artwork", "Artwork not found");
        }
        artWorkRepository.deleteById(id);
    }

    public Page<ArtWorkResponseDto> filter(String name,
                                           String idArtist,
                                           String idGenre,
                                           Double minPrice,
                                           Double maxPrice,
                                           int page,
                                           int size,
                                           String sortBy,
                                           Sort.Direction direction) {
        List<Criteria> criteriaList = new ArrayList<>();
        if (name != null && !name.isBlank()) {
            criteriaList.add(Criteria.where("name").regex(name, "i"));
        }
        if (idArtist != null && !idArtist.isBlank()) {
            criteriaList.add(Criteria.where("artistId").is(idArtist));
        }
        if (idGenre != null && !idGenre.isBlank()) {
            criteriaList.add(Criteria.where("genre.id").is(idGenre));
        }
        if (minPrice != null || maxPrice != null) {
            Criteria priceCriteria = Criteria.where("price");
            if (minPrice != null) {
                priceCriteria = priceCriteria.gte(minPrice);
            }
            if (maxPrice != null) {
                priceCriteria = priceCriteria.lte(maxPrice);
            }
            criteriaList.add(priceCriteria);
        }

        Query query = new Query();
        if (!criteriaList.isEmpty()) {
            query.addCriteria(new Criteria().andOperator(criteriaList.toArray(new Criteria[0])));
        }

        PageRequest pageRequest = PageRequest.of(page, size, Sort.by(direction, sortBy));
        query.with(pageRequest);

        long total = mongoTemplate.count(query.skip(-1).limit(-1), ArtWorkDocument.class);
        List<ArtWorkDocument> results = mongoTemplate.find(query, ArtWorkDocument.class);
        return new PageImpl<>(artWorkMapper.toResponseDto(results), pageRequest, total);
    }

    public ContainerCeramicResponseDto createCeramic(ContainerCeramicRequestDto dto) {
        ArtWorkDocument document = buildBaseArtwork(dto.artWorkRequest());
        CeramicDocument ceramic = artWorkMapper.toCeramicDocument(dto.ceramicRequest());
        ArtWorkDocument saved = saveWithDetailsId(document, ceramic);
        return artWorkMapper.toContainerCeramicResponse(
                artWorkMapper.toResponseDto(saved),
                buildCeramicResponse(saved.getId(), ceramic));
    }

    public ContainerGoldsmithResponseDto createGoldsmith(ContainerGoldsmithRequestDto dto) {
        ArtWorkDocument document = buildBaseArtwork(dto.artWorkRequest());
        GoldsmithDocument goldsmith = artWorkMapper.toGoldsmithDocument(dto.goldsmithRequest());
        ArtWorkDocument saved = saveWithDetailsId(document, goldsmith);
        return artWorkMapper.toContainerGoldsmithResponse(
                artWorkMapper.toResponseDto(saved),
                buildGoldsmithResponse(saved.getId(), goldsmith));
    }

    public ContainerPaintingResponseDto createPainting(ContainerPaintingRequestDto dto) {
        ArtWorkDocument document = buildBaseArtwork(dto.artWorkRequest());
        PaintingDocument painting = artWorkMapper.toPaintingDocument(dto.paintingRequest());
        ArtWorkDocument saved = saveWithDetailsId(document, painting);
        return artWorkMapper.toContainerPaintingResponse(
                artWorkMapper.toResponseDto(saved),
                buildPaintingResponse(saved.getId(), painting));
    }

    public ContainerPhotographyResponseDto createPhotography(ContainerPhotographyRequestDto dto) {
        ArtWorkDocument document = buildBaseArtwork(dto.artWorkRequest());
        PhotographyDocument photography = artWorkMapper.toPhotographyDocument(dto.photographyRequest());
        ArtWorkDocument saved = saveWithDetailsId(document, photography);
        return artWorkMapper.toContainerPhotographyResponse(
                artWorkMapper.toResponseDto(saved),
                buildPhotographyResponse(saved.getId(), photography));
    }

    public ContainerSculptureResponseDto createSculpture(ContainerSculptureRequestDto dto) {
        ArtWorkDocument document = buildBaseArtwork(dto.artWorkRequest());
        SculptureDocument sculpture = artWorkMapper.toSculptureDocument(dto.sculptureRequest());
        ArtWorkDocument saved = saveWithDetailsId(document, sculpture);
        return artWorkMapper.toContainerSculptureResponse(
                buildSculptureResponse(saved.getId(), sculpture),
                artWorkMapper.toResponseDto(saved));
    }

    public ArtWorkDocument getArtWorkDocumentById(String id) {
        return artWorkRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("artwork", "Artwork not found"));
    }

    public Object getSpecificArtWork(String id) {
        ArtWorkDocument doc = getArtWorkDocumentById(id);
        Object details = doc.getType_details();
        if (details == null) {
            throw new ResourceNotFoundException("artwork-details", "Artwork does not have an associated type");
        }

        ArtWorkResponseDto artResp = artWorkMapper.toResponseDto(doc);
        if (details instanceof CeramicDocument ceramic) {
            return artWorkMapper.toContainerCeramicResponse(artResp, buildCeramicResponse(doc.getId(), ceramic));
        }
        if (details instanceof PaintingDocument painting) {
            return artWorkMapper.toContainerPaintingResponse(artResp, buildPaintingResponse(doc.getId(), painting));
        }
        if (details instanceof PhotographyDocument photography) {
            return artWorkMapper.toContainerPhotographyResponse(artResp, buildPhotographyResponse(doc.getId(), photography));
        }
        if (details instanceof SculptureDocument sculpture) {
            return artWorkMapper.toContainerSculptureResponse(buildSculptureResponse(doc.getId(), sculpture), artResp);
        }
        if (details instanceof GoldsmithDocument goldsmith) {
            return artWorkMapper.toContainerGoldsmithResponse(artResp, buildGoldsmithResponse(doc.getId(), goldsmith));
        }

        throw new ResourceNotFoundException("artwork-details", "No subtype handled for this artwork");
    }

    private ArtWorkDocument buildBaseArtwork(ArtWorkRequestDto dto) {
        ArtistDocument artist = artistRepository.findById(dto.idArtist())
                .orElseThrow(() -> new ResourceNotFoundException("artist", "Artist not found"));
        GenreDocument genre = genreRepository.findById(dto.idGenre())
                .orElseThrow(() -> new ResourceNotFoundException("genre", "Genre not found"));

        ArtWorkDocument document = artWorkMapper.toDocument(dto);
        document.setArtistId(artist.getId());
        document.setArtistName(buildArtistName(artist));
        document.setGenre(genre);
        document.setCreatedAt(LocalDateTime.now());
        document.setModifiedAt(LocalDateTime.now());
        return document;
    }

    private String buildArtistName(ArtistDocument artist) {
        String name = artist.getName() == null ? "" : artist.getName().trim();
        String lastName = artist.getLastName() == null ? "" : artist.getLastName().trim();
        if (name.isEmpty()) {
            return lastName;
        }
        if (lastName.isEmpty()) {
            return name;
        }
        return name + " " + lastName;
    }

    private CeramicResponseDto buildCeramicResponse(String artWorkId, CeramicDocument ceramic) {
        return new CeramicResponseDto(
                artWorkId,
                ceramic.getMaterialType(),
                ceramic.getTechnique(),
                ceramic.getFinish(),
                ceramic.getCookingTemperature(),
                ceramic.getWeight(),
                ceramic.getWidth(),
                ceramic.getHeight());
    }

    private PaintingResponseDto buildPaintingResponse(String artWorkId, PaintingDocument painting) {
        return new PaintingResponseDto(
                artWorkId,
                painting.getTechnique(),
                painting.getHolder(),
                painting.getStyle(),
                painting.getFramed(),
                painting.getWidth(),
                painting.getHeight());
    }

    private PhotographyResponseDto buildPhotographyResponse(String artWorkId, PhotographyDocument photo) {
        return new PhotographyResponseDto(
                artWorkId,
                photo.getPrintType(),
                photo.getResolution(),
                photo.getColor(),
                photo.getSerialNumber(),
                photo.getCamera());
    }

    private SculptureResponseDto buildSculptureResponse(String artWorkId, SculptureDocument sculpture) {
        return new SculptureResponseDto(
                artWorkId,
                sculpture.getMaterial(),
                sculpture.getWeight(),
                sculpture.getLength(),
                sculpture.getWidth(),
                sculpture.getDepth());
    }

    private GoldsmithResponseDto buildGoldsmithResponse(String artWorkId, GoldsmithDocument goldsmith) {
        return new GoldsmithResponseDto(
                artWorkId,
                goldsmith.getMaterial(),
                goldsmith.getPreciousStones(),
                goldsmith.getWeight());
    }

    private <T extends ArtWorkDocument> ArtWorkDocument saveWithDetailsId(ArtWorkDocument base, T details) {
        base.setType_details(details);
        ArtWorkDocument saved = artWorkRepository.save(base);
        details.setId(saved.getId());
        saved.setType_details(details);
        return artWorkRepository.save(saved);
    }
}

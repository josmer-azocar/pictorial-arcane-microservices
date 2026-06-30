package com.pictorial.artwork_service.service;

import com.pictorial.artwork_service.client.AuditClient;
import com.pictorial.artwork_service.client.dto.ArtworkStatusHistoryRequest;
import com.pictorial.artwork_service.document.*;
import com.pictorial.artwork_service.dto.request.*;
import com.pictorial.artwork_service.dto.response.*;
import com.pictorial.artwork_service.exception.InvalidArtworkStatusException;
import com.pictorial.artwork_service.exception.ResourceNotFoundException;
import com.pictorial.artwork_service.mapper.ArtWorkMapper;
import com.pictorial.artwork_service.mapper.ArtWorkStatusMapper;
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
    private final SequenceGeneratorService sequenceGenerator;
    private final AuditClient auditClient;

    public ArtWorkService(ArtWorkRepository artWorkRepository,
                          ArtistRepository artistRepository,
                          GenreRepository genreRepository,
                          ArtWorkMapper artWorkMapper,
                          MongoTemplate mongoTemplate,
                          SequenceGeneratorService sequenceGenerator,
                          AuditClient auditClient) {
        this.artWorkRepository = artWorkRepository;
        this.artistRepository = artistRepository;
        this.genreRepository = genreRepository;
        this.artWorkMapper = artWorkMapper;
        this.mongoTemplate = mongoTemplate;
        this.sequenceGenerator = sequenceGenerator;
        this.auditClient = auditClient;
    }

    public ArtWorkResponseDto create(ArtWorkRequestDto dto) {
        if (dto == null) {
            throw new IllegalArgumentException("Artwork request body cannot be null");
        }
        ArtWorkDocument document = buildBaseArtwork(dto);
        return artWorkMapper.toResponseDto(artWorkRepository.save(document));
    }

    public List<ArtWorkResponseDto> getAll() {
        return artWorkMapper.toResponseDto(artWorkRepository.findAll());
    }

    public ArtWorkResponseDto getById(String id) {
        if (id == null || id.isBlank()) {
            throw new IllegalArgumentException("Artwork ID cannot be null or blank");
        }
        ArtWorkDocument document = artWorkRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("artwork", "Artwork not found"));
        return artWorkMapper.toResponseDto(document);
    }

    public ArtWorkResponseDto update(String id, UpdateArtWorkDto dto) {
        if (id == null || id.isBlank()) {
            throw new IllegalArgumentException("Artwork ID cannot be null or blank");
        }
        if (dto == null) {
            throw new IllegalArgumentException("Artwork update body cannot be null");
        }
        ArtWorkDocument document = artWorkRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("artwork", "Artwork not found"));
        artWorkMapper.updateDocumentFromDto(dto, document);
        document.setModifiedAt(LocalDateTime.now());
        return artWorkMapper.toResponseDto(artWorkRepository.save(document));
    }

    public void delete(String id) {
        if (id == null || id.isBlank()) {
            throw new IllegalArgumentException("Artwork ID cannot be null or blank");
        }
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

        // Se cuenta el total ANTES de aplicar la paginación para no contaminar la query.
        long total = mongoTemplate.count(query, ArtWorkDocument.class);

        PageRequest pageRequest = PageRequest.of(page, size, Sort.by(direction, sortBy));
        query.with(pageRequest);

        List<ArtWorkDocument> results = mongoTemplate.find(query, ArtWorkDocument.class);
        return new PageImpl<>(artWorkMapper.toResponseDto(results), pageRequest, total);
    }
    public ContainerCeramicResponseDto createCeramic(ContainerCeramicRequestDto dto) {
        if (dto == null) {
            throw new IllegalArgumentException("Container ceramic request body cannot be null");
        }
        if (dto.artWorkRequest() == null) {
            throw new IllegalArgumentException("Artwork request cannot be null");
        }
        if (dto.ceramicRequest() == null) {
            throw new IllegalArgumentException("Ceramic details request cannot be null");
        }
        ArtWorkDocument document = buildBaseArtwork(dto.artWorkRequest());
        CeramicDocument ceramic = artWorkMapper.toCeramicDocument(dto.ceramicRequest());
        ArtWorkDocument saved = saveWithDetails(document, ceramic);
        return artWorkMapper.toContainerCeramicResponse(
                artWorkMapper.toResponseDto(saved),
                buildCeramicResponse(saved.getId(), ceramic));
    }

    public ContainerGoldsmithResponseDto createGoldsmith(ContainerGoldsmithRequestDto dto) {
        if (dto == null) {
            throw new IllegalArgumentException("Container goldsmith request body cannot be null");
        }
        if (dto.artWorkRequest() == null) {
            throw new IllegalArgumentException("Artwork request cannot be null");
        }
        if (dto.goldsmithRequest() == null) {
            throw new IllegalArgumentException("Goldsmith details request cannot be null");
        }
        ArtWorkDocument document = buildBaseArtwork(dto.artWorkRequest());
        GoldsmithDocument goldsmith = artWorkMapper.toGoldsmithDocument(dto.goldsmithRequest());
        ArtWorkDocument saved = saveWithDetails(document, goldsmith);
        return artWorkMapper.toContainerGoldsmithResponse(
                artWorkMapper.toResponseDto(saved),
                buildGoldsmithResponse(saved.getId(), goldsmith));
    }

    public ContainerPaintingResponseDto createPainting(ContainerPaintingRequestDto dto) {
        if (dto == null) {
            throw new IllegalArgumentException("Container painting request body cannot be null");
        }
        if (dto.artWorkRequest() == null) {
            throw new IllegalArgumentException("Artwork request cannot be null");
        }
        if (dto.paintingRequest() == null) {
            throw new IllegalArgumentException("Painting details request cannot be null");
        }
        ArtWorkDocument document = buildBaseArtwork(dto.artWorkRequest());
        PaintingDocument painting = artWorkMapper.toPaintingDocument(dto.paintingRequest());
        ArtWorkDocument saved = saveWithDetails(document, painting);
        return artWorkMapper.toContainerPaintingResponse(
                artWorkMapper.toResponseDto(saved),
                buildPaintingResponse(saved.getId(), painting));
    }

    public ContainerPhotographyResponseDto createPhotography(ContainerPhotographyRequestDto dto) {
        if (dto == null) {
            throw new IllegalArgumentException("Container photography request body cannot be null");
        }
        if (dto.artWorkRequest() == null) {
            throw new IllegalArgumentException("Artwork request cannot be null");
        }
        if (dto.photographyRequest() == null) {
            throw new IllegalArgumentException("Photography details request cannot be null");
        }
        ArtWorkDocument document = buildBaseArtwork(dto.artWorkRequest());
        PhotographyDocument photography = artWorkMapper.toPhotographyDocument(dto.photographyRequest());
        ArtWorkDocument saved = saveWithDetails(document, photography);
        return artWorkMapper.toContainerPhotographyResponse(
                artWorkMapper.toResponseDto(saved),
                buildPhotographyResponse(saved.getId(), photography));
    }

    public ContainerSculptureResponseDto createSculpture(ContainerSculptureRequestDto dto) {
        if (dto == null) {
            throw new IllegalArgumentException("Container sculpture request body cannot be null");
        }
        if (dto.artWorkRequest() == null) {
            throw new IllegalArgumentException("Artwork request cannot be null");
        }
        if (dto.sculptureRequest() == null) {
            throw new IllegalArgumentException("Sculpture details request cannot be null");
        }
        ArtWorkDocument document = buildBaseArtwork(dto.artWorkRequest());
        SculptureDocument sculpture = artWorkMapper.toSculptureDocument(dto.sculptureRequest());
        ArtWorkDocument saved = saveWithDetails(document, sculpture);
        return artWorkMapper.toContainerSculptureResponse(
                buildSculptureResponse(saved.getId(), sculpture),
                artWorkMapper.toResponseDto(saved));
    }

    public ArtWorkDocument getArtWorkDocumentById(String id) {
        if (id == null || id.isBlank()) {
            throw new IllegalArgumentException("Artwork ID cannot be null or blank");
        }
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
        document.setArtworkId(sequenceGenerator.nextValue(SequenceGeneratorService.ARTWORK_SEQUENCE));
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

    // Los subtipos (Ceramic, Painting, etc.) se guardan embebidos en type_details como objetos
    // planos; el id de la obra es el del documento base, por lo que basta con un único save.
    private ArtWorkDocument saveWithDetails(ArtWorkDocument base, Object details) {
        base.setType_details(details);
        return artWorkRepository.save(base);
    }

    // ---------------------------------------------------------------------
    // Transiciones de estado (invocadas por core-service vía la clave Long).
    // ---------------------------------------------------------------------

    /** AVAILABLE -> RESERVED. Falla si la obra no está disponible. */
    public ArtWorkResponseDto reserve(Long artworkId, Long changedBy, String reason) {
        return changeStatus(artworkId, ArtWorkStatus.AVAILABLE, ArtWorkStatus.RESERVED, changedBy, reason);
    }

    /** RESERVED -> SOLD. Falla si la obra no está reservada. */
    public ArtWorkResponseDto markSold(Long artworkId, Long changedBy, String reason) {
        return changeStatus(artworkId, ArtWorkStatus.RESERVED, ArtWorkStatus.SOLD, changedBy, reason);
    }

    /** RESERVED -> AVAILABLE. Libera una reserva. */
    public ArtWorkResponseDto release(Long artworkId, Long changedBy, String reason) {
        return changeStatus(artworkId, ArtWorkStatus.RESERVED, ArtWorkStatus.AVAILABLE, changedBy, reason);
    }

    private ArtWorkResponseDto changeStatus(Long artworkId, ArtWorkStatus expected, ArtWorkStatus target,
                                            Long changedBy, String reason) {
        if (artworkId == null) {
            throw new IllegalArgumentException("Artwork ID cannot be null");
        }
        if (changedBy == null) {
            throw new IllegalArgumentException("ChangedBy user ID cannot be null");
        }
        ArtWorkDocument doc = artWorkRepository.findByArtworkId(artworkId)
                .orElseThrow(() -> new ResourceNotFoundException("artwork", "Artwork not found for id " + artworkId));

        ArtWorkStatus current = ArtWorkStatusMapper.stringToArtWorkStatus(doc.getStatus());
        if (current != expected) {
            throw new InvalidArtworkStatusException(
                    "La obra " + artworkId + " está en estado " + doc.getStatus()
                            + "; se requiere " + expected + " para pasar a " + target + ".");
        }

        String oldStatus = doc.getStatus();
        doc.setStatus(target.name());
        doc.setModifiedAt(LocalDateTime.now());
        ArtWorkDocument saved = artWorkRepository.save(doc);

        // Auditoría best-effort del cambio de estado.
        auditClient.registerStatusChange(new ArtworkStatusHistoryRequest(
                saved.getArtworkId(),
                saved.getName(),
                changedBy,
                target.name(),
                oldStatus,
                reason));

        return artWorkMapper.toResponseDto(saved);
    }
}

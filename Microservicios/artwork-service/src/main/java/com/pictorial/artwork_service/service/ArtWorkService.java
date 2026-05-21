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
import java.util.List;
import java.util.Optional;

@Service
public class ArtWorkService {

    private final ArtWorkRepository artWorkRepository;
    private final ArtistRepository artistRepository;
    private final GenreRepository genreRepository;
    private final ArtWorkMapper artWorkMapper;
    private final MongoTemplate mongoTemplate;

    public ArtWorkService(ArtWorkRepository artWorkRepository, ArtistRepository artistRepository,
                          GenreRepository genreRepository, ArtWorkMapper artWorkMapper,
                          MongoTemplate mongoTemplate) {
        this.artWorkRepository = artWorkRepository;
        this.artistRepository = artistRepository;
        this.genreRepository = genreRepository;
        this.artWorkMapper = artWorkMapper;
        this.mongoTemplate = mongoTemplate;
    }

    public List<ArtWorkResponseDto> getAll() {
        return artWorkRepository.findAll()
                .stream()
                .map(artWorkMapper::toResponseDto)
                .toList();
    }

    public ArtWorkResponseDto getById(String id) {
        ArtWorkDocument document = artWorkRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("artwork", "ArtWork not found with id: " + id));
        return artWorkMapper.toResponseDto(document);
    }

    public ArtWorkResponseDto create(ArtWorkRequestDto dto) {
        validateArtistAndGenre(dto.idArtist(), dto.idGenre());

        ArtWorkDocument document = artWorkMapper.toDocument(dto);
        enrichWithNames(document, dto.idArtist(), dto.idGenre());
        document.setCreatedAt(LocalDateTime.now());
        document.setModifiedAt(LocalDateTime.now());
        ArtWorkDocument saved = artWorkRepository.save(document);
        return artWorkMapper.toResponseDto(saved);
    }

    public ContainerPaintingResponseDto createPainting(ContainerPaintingRequestDto container) {
        ArtWorkRequestDto artDto = container.artWorkRequest();
        PaintingRequestDto paintingDto = container.paintingRequest();
        validateArtistAndGenre(artDto.idArtist(), artDto.idGenre());

        PaintingDocument document = new PaintingDocument();
        setBaseFields(document, artDto);
        document.setTechnique(paintingDto.technique());
        document.setHolder(paintingDto.holder());
        document.setStyle(paintingDto.style());
        document.setFramed(paintingDto.framed());
        document.setWidth(paintingDto.width());
        document.setHeight(paintingDto.height());
        document.setCreatedAt(LocalDateTime.now());
        document.setModifiedAt(LocalDateTime.now());

        PaintingDocument saved = artWorkRepository.save(document);
        ArtWorkResponseDto artResponse = artWorkMapper.toResponseDto(saved);
        PaintingResponseDto paintingResponse = artWorkMapper.toPaintingResponse(saved);
        return artWorkMapper.toContainerPaintingResponse(artResponse, paintingResponse);
    }

    public ContainerSculptureResponseDto createSculpture(ContainerSculptureRequestDto container) {
        ArtWorkRequestDto artDto = container.artWorkRequest();
        SculptureRequestDto sculptureDto = container.sculptureRequest();
        validateArtistAndGenre(artDto.idArtist(), artDto.idGenre());

        SculptureDocument document = new SculptureDocument();
        setBaseFields(document, artDto);
        document.setMaterial(sculptureDto.material());
        document.setWeight(sculptureDto.weight());
        document.setLength(sculptureDto.length());
        document.setWidth(sculptureDto.width());
        document.setDepth(sculptureDto.depth());

        SculptureDocument saved = artWorkRepository.save(document);
        ArtWorkResponseDto artResponse = artWorkMapper.toResponseDto(saved);
        SculptureResponseDto sculptureResponse = artWorkMapper.toSculptureResponse(saved);
        return artWorkMapper.toContainerSculptureResponse(sculptureResponse, artResponse);
    }

    public ContainerCeramicResponseDto createCeramic(ContainerCeramicRequestDto container) {
        ArtWorkRequestDto artDto = container.artWorkRequest();
        CeramicRequestDto ceramicDto = container.ceramicRequest();
        validateArtistAndGenre(artDto.idArtist(), artDto.idGenre());

        CeramicDocument document = new CeramicDocument();
        setBaseFields(document, artDto);
        document.setMaterialType(ceramicDto.materialType());
        document.setTechnique(ceramicDto.technique());
        document.setFinish(ceramicDto.finish());
        document.setCookingTemperature(ceramicDto.cookingTemperature());
        document.setWeight(ceramicDto.weight());
        document.setWidth(ceramicDto.width());
        document.setHeight(ceramicDto.height());

        CeramicDocument saved = artWorkRepository.save(document);
        ArtWorkResponseDto artResponse = artWorkMapper.toResponseDto(saved);
        CeramicResponseDto ceramicResponse = artWorkMapper.toCeramicResponse(saved);
        return artWorkMapper.toContainerCeramicResponse(artResponse, ceramicResponse);
    }

    public ContainerPhotographyResponseDto createPhotography(ContainerPhotographyRequestDto container) {
        ArtWorkRequestDto artDto = container.artWorkRequest();
        PhotographyRequestDto photoDto = container.photographyRequest();
        validateArtistAndGenre(artDto.idArtist(), artDto.idGenre());

        PhotographyDocument document = new PhotographyDocument();
        setBaseFields(document, artDto);
        document.setPrintType(photoDto.printType());
        document.setResolution(photoDto.resolution());
        document.setColor(photoDto.color());
        document.setSerialNumber(photoDto.serialNumber());
        document.setCamera(photoDto.camera());

        PhotographyDocument saved = artWorkRepository.save(document);
        ArtWorkResponseDto artResponse = artWorkMapper.toResponseDto(saved);
        PhotographyResponseDto photoResponse = artWorkMapper.toPhotographyResponse(saved);
        return artWorkMapper.toContainerPhotographyResponse(artResponse, photoResponse);
    }

    public ContainerGoldsmithResponseDto createGoldsmith(ContainerGoldsmithRequestDto container) {
        ArtWorkRequestDto artDto = container.artWorkRequest();
        GoldsmithRequestDto goldsmithDto = container.goldsmithRequest();
        validateArtistAndGenre(artDto.idArtist(), artDto.idGenre());

        GoldsmithDocument document = new GoldsmithDocument();
        setBaseFields(document, artDto);
        document.setMaterial(goldsmithDto.material());
        document.setPreciousStones(goldsmithDto.preciousStones());
        document.setWeight(goldsmithDto.weight());

        GoldsmithDocument saved = artWorkRepository.save(document);
        ArtWorkResponseDto artResponse = artWorkMapper.toResponseDto(saved);
        GoldsmithResponseDto goldsmithResponse = artWorkMapper.toGoldsmithResponse(saved);
        return artWorkMapper.toContainerGoldsmithResponse(artResponse, goldsmithResponse);
    }

    public ArtWorkResponseDto update(String id, UpdateArtWorkDto dto) {
        ArtWorkDocument document = artWorkRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("artwork", "ArtWork not found with id: " + id));
        artWorkMapper.updateDocumentFromDto(dto, document);
        document.setModifiedAt(LocalDateTime.now());
        ArtWorkDocument saved = artWorkRepository.save(document);
        return artWorkMapper.toResponseDto(saved);
    }

    public void delete(String id) {
        if (!artWorkRepository.existsById(id)) {
            throw new ResourceNotFoundException("artwork", "ArtWork not found with id: " + id);
        }
        artWorkRepository.deleteById(id);
    }

    public Page<ArtWorkResponseDto> filter(String name, String artistId, String genreId,
                                           Double minPrice, Double maxPrice,
                                           int page, int size, String sortBy, Sort.Direction direction) {
        Query query = new Query();
        Criteria criteria = new Criteria();

        if (name != null && !name.isBlank()) {
            criteria = criteria.and("name").regex(".*" + name + ".*", "i");
        }
        if (artistId != null && !artistId.isBlank()) {
            criteria = criteria.and("artistId").is(artistId);
        }
        if (genreId != null && !genreId.isBlank()) {
            criteria = criteria.and("genreId").is(genreId);
        }
        if (minPrice != null && maxPrice != null) {
            criteria = criteria.and("price").gte(minPrice).lte(maxPrice);
        } else if (minPrice != null) {
            criteria = criteria.and("price").gte(minPrice);
        } else if (maxPrice != null) {
            criteria = criteria.and("price").lte(maxPrice);
        }

        if (!criteria.getCriteriaObject().isEmpty()) {
            query.addCriteria(criteria);
        }

        long total = mongoTemplate.count(query, ArtWorkDocument.class);
        query.with(PageRequest.of(page, size, direction != null ? direction : Sort.Direction.ASC, sortBy != null ? sortBy : "name"));

        List<ArtWorkResponseDto> content = mongoTemplate.find(query, ArtWorkDocument.class)
                .stream()
                .map(artWorkMapper::toResponseDto)
                .toList();

        return new PageImpl<>(content, PageRequest.of(page, size), total);
    }

    public ArtWorkDocument getArtWorkDocumentById(String id) {
        return artWorkRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("artwork", "ArtWork not found with id: " + id));
    }

    private void validateArtistAndGenre(String artistId, String genreId) {
        if (!artistRepository.existsById(artistId)) {
            throw new ResourceNotFoundException("artist", "Artist not found with id: " + artistId);
        }
        if (!genreRepository.existsById(genreId)) {
            throw new ResourceNotFoundException("genre", "Genre not found with id: " + genreId);
        }
    }

    private void enrichWithNames(ArtWorkDocument document, String artistId, String genreId) {
        artistRepository.findById(artistId).ifPresent(a -> document.setArtistName(a.getName() + " " + a.getLastName()));
        genreRepository.findById(genreId).ifPresent(g -> document.setGenreName(g.getName()));
    }

    private void setBaseFields(ArtWorkDocument document, ArtWorkRequestDto dto) {
        document.setName(dto.name());
        document.setStatus(dto.status());
        document.setPrice(dto.price());
        document.setArtistId(dto.idArtist());
        document.setGenreId(dto.idGenre());
        enrichWithNames(document, dto.idArtist(), dto.idGenre());
    }
}

package com.uneg.pictorialArcane.persistence.impl_repository;

import com.uneg.pictorialArcane.domain.dto.request.ContainerPaintingRequestDto;
import com.uneg.pictorialArcane.domain.dto.response.ContainerPaintingResponseDto;
import com.uneg.pictorialArcane.domain.exception.ArtistDoesNotExistsException;
import com.uneg.pictorialArcane.domain.exception.ArtWorkDoesNotExistsException;
import com.uneg.pictorialArcane.persistence.crud_repository.CrudArtistRepository;
import com.uneg.pictorialArcane.persistence.crud_repository.CrudPaintingRepository;
import com.uneg.pictorialArcane.persistence.entity.PaintingEntity;
import com.uneg.pictorialArcane.persistence.mapper.PaintingMapper;
import org.springframework.stereotype.Repository;


@Repository
public class PaintingRepository {

    private final CrudPaintingRepository crudPaintingRepository;
    private final CrudArtistRepository crudArtistRepository;
    private final PaintingMapper paintingMapper;


    public PaintingRepository(CrudPaintingRepository crudPaintingRepository, CrudArtistRepository crudArtistRepository, PaintingMapper paintingMapper) {
        this.crudPaintingRepository = crudPaintingRepository;
        this.crudArtistRepository = crudArtistRepository;
        this.paintingMapper = paintingMapper;
    }

    public ContainerPaintingResponseDto addPainting(ContainerPaintingRequestDto dto){
        Long artistId = dto.artWorkRequest().idArtist();
        if (!this.crudArtistRepository.existsById(artistId)) {throw new ArtistDoesNotExistsException(artistId);}
        PaintingEntity entity = paintingMapper.toEntity(dto);
        PaintingEntity saved = this.crudPaintingRepository.save(entity);
        return paintingMapper.toContainerResponseDto(saved);
    }

    // Nuevo: buscar por id de obra
    public ContainerPaintingResponseDto findByArtWorkId(Long artWorkId) {
        PaintingEntity entity = this.crudPaintingRepository.findFirstByIdArtWork(artWorkId)
                .orElseThrow(() -> new ArtWorkDoesNotExistsException(artWorkId));
        return paintingMapper.toContainerResponseDto(entity);
    }
}

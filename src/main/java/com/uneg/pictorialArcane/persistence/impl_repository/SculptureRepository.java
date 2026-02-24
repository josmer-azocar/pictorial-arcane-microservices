package com.uneg.pictorialArcane.persistence.impl_repository;

import com.uneg.pictorialArcane.domain.dto.request.ContainerSculptureRequestDto;
import com.uneg.pictorialArcane.domain.dto.response.ContainerSculptureResponseDto;
import com.uneg.pictorialArcane.domain.exception.ArtistDoesNotExistsException;
import com.uneg.pictorialArcane.persistence.crud_repository.CrudArtistRepository;
import com.uneg.pictorialArcane.persistence.crud_repository.CrudSculptureRepository;
import com.uneg.pictorialArcane.persistence.entity.SculptureEntity;
import com.uneg.pictorialArcane.persistence.mapper.SculptureMapper;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public class SculptureRepository {

    private final CrudSculptureRepository crudSculptureRepository;
    private final CrudArtistRepository crudArtistRepository;
    private final SculptureMapper sculptureMapper;

    public SculptureRepository(CrudSculptureRepository crudSculptureRepository, CrudArtistRepository crudArtistRepository, SculptureMapper sculptureMapper) {
        this.crudSculptureRepository = crudSculptureRepository;
        this.crudArtistRepository = crudArtistRepository;
        this.sculptureMapper = sculptureMapper;
    }

    public ContainerSculptureResponseDto addSculpture(ContainerSculptureRequestDto dto){
        Long artistId = dto.artWorkRequest().idArtist();
        if (!this.crudArtistRepository.existsById(artistId)) {throw new ArtistDoesNotExistsException(artistId);}
        SculptureEntity entity = sculptureMapper.toEntity(dto);
        SculptureEntity saved = this.crudSculptureRepository.save(entity);
        return sculptureMapper.toContainerResponseDto(saved);
    }

}

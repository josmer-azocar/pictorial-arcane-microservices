package com.uneg.pictorialArcane.persistence.impl_repository;

import com.uneg.pictorialArcane.domain.dto.request.ContainerCeramicRequestDto;
import com.uneg.pictorialArcane.domain.dto.response.ContainerCeramicResponseDto;
import com.uneg.pictorialArcane.domain.exception.ArtistDoesNotExistsException;
import com.uneg.pictorialArcane.domain.exception.ArtWorkDoesNotExistsException;
import com.uneg.pictorialArcane.persistence.crud_repository.CrudArtistRepository;
import com.uneg.pictorialArcane.persistence.crud_repository.CrudCeramicRepository;
import com.uneg.pictorialArcane.persistence.entity.CeramicEntity;
import com.uneg.pictorialArcane.persistence.mapper.CeramicMapper;
import org.springframework.stereotype.Repository;

@Repository
public class CeramicRepository {

    private final CrudCeramicRepository crudCeramicRepository;
    private final CrudArtistRepository crudArtistRepository;
    private final CeramicMapper ceramicMapper;

    public CeramicRepository(CrudCeramicRepository crudCeramicRepository, CrudArtistRepository crudArtistRepository, CeramicMapper ceramicMapper) {
        this.crudCeramicRepository = crudCeramicRepository;
        this.crudArtistRepository = crudArtistRepository;
        this.ceramicMapper = ceramicMapper;
    }

    public ContainerCeramicResponseDto addCeramic(ContainerCeramicRequestDto dto){
        Long artistId = dto.artWorkRequest().idArtist();
        if (!this.crudArtistRepository.existsById(artistId)) {throw new ArtistDoesNotExistsException(artistId);}
        CeramicEntity entity = ceramicMapper.toEntity(dto);
        CeramicEntity saved = this.crudCeramicRepository.save(entity);
        return ceramicMapper.toContainerResponseDto(saved);
    }

    public ContainerCeramicResponseDto findByArtWorkId(Long artWorkId) {
        CeramicEntity entity = this.crudCeramicRepository.findById(artWorkId)
                .orElseThrow(() -> new ArtWorkDoesNotExistsException(artWorkId));
        return ceramicMapper.toContainerResponseDto(entity);
    }
}

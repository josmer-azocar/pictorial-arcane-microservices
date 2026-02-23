package com.uneg.pictorialArcane.persistence.impl_repository;

import com.uneg.pictorialArcane.domain.dto.request.ContainerPhotographyRequestDto;
import com.uneg.pictorialArcane.domain.dto.response.ContainerPhotographyResponseDto;
import com.uneg.pictorialArcane.domain.exception.ArtistDoesNotExistsException;
import com.uneg.pictorialArcane.persistence.crud_repository.CrudArtistRepository;
import com.uneg.pictorialArcane.persistence.crud_repository.CrudPhotographyRepository;
import com.uneg.pictorialArcane.persistence.entity.PhotographyEntity;
import com.uneg.pictorialArcane.persistence.mapper.PhotographyMapper;
import org.springframework.stereotype.Repository;

@Repository
public class PhotographyRepository {
    CrudArtistRepository crudArtistRepository;
    PhotographyMapper photographyMapper;
    CrudPhotographyRepository crudPhotographyRepository;

    public PhotographyRepository(CrudArtistRepository crudArtistRepository, PhotographyMapper photographyMapper, CrudPhotographyRepository crudPhotographyRepository) {
        this.crudArtistRepository = crudArtistRepository;
        this.photographyMapper = photographyMapper;
        this.crudPhotographyRepository = crudPhotographyRepository;
    }

    public ContainerPhotographyResponseDto addPhotography(ContainerPhotographyRequestDto dto){
        Long artistId =dto.artWorkRequest().idArtist();
        if (!this.crudArtistRepository.existsById(artistId)){throw new ArtistDoesNotExistsException(artistId);}
        PhotographyEntity entity = photographyMapper.toEntity(dto);
        PhotographyEntity saved = this.crudPhotographyRepository.save(entity);
        return photographyMapper.toContainerResponseDto(saved);
    }

}

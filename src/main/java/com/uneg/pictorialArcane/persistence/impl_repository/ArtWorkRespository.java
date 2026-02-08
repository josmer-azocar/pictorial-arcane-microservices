package com.uneg.pictorialArcane.persistence.impl_repository;

import com.uneg.pictorialArcane.domain.dto.request.ArtWorkRequestDto;
import com.uneg.pictorialArcane.domain.dto.response.ArtWorkResponseDto;
import com.uneg.pictorialArcane.domain.dto.update.UpdateArtWorkDto;
import com.uneg.pictorialArcane.domain.exception.ArtWorkDoesNotExistsException;
import com.uneg.pictorialArcane.persistence.crud_repository.CrudArtWorkRepository;
import com.uneg.pictorialArcane.persistence.entity.ArtWorkEntity;
import com.uneg.pictorialArcane.persistence.mapper.ArtWorkMapper;
import org.springframework.stereotype.Repository;


import java.util.List;
import java.util.Optional;

@Repository
public class ArtWorkRespository {

    private final CrudArtWorkRepository crudArtWorkRepository;
    private final ArtWorkMapper artWorkMapper;

    public ArtWorkRespository(CrudArtWorkRepository crudArtWorkRepository, ArtWorkMapper artWorkMapper) {
        this.crudArtWorkRepository = crudArtWorkRepository;
        this.artWorkMapper = artWorkMapper;
    }

    public ArtWorkResponseDto addArtWork(ArtWorkRequestDto artWork) {

        ArtWorkEntity entity = artWorkMapper.toEntity(artWork);

        return artWorkMapper.toResponseDto(this.crudArtWorkRepository.save(entity));
    }

    public List<ArtWorkEntity> findAllArtWorks() {

        return (List<ArtWorkEntity>) this.crudArtWorkRepository.findAll();
    }

    public ArtWorkResponseDto getArtWorkById(Long id) {
        if (this.crudArtWorkRepository.findFirstByIdArtWork(id) == null) throw new ArtWorkDoesNotExistsException(id);

        return artWorkMapper.toResponseDto(this.crudArtWorkRepository.findFirstByIdArtWork(id));
    }

    public void eraseArtWorkById(Long id) {
        this.crudArtWorkRepository.deleteById(id);
    }


    public ArtWorkResponseDto updateArtWork(Long id, UpdateArtWorkDto artWork){
        ArtWorkEntity entity = this.crudArtWorkRepository.findFirstByIdArtWork(id);
        if(entity == null) throw new ArtWorkDoesNotExistsException(id);
        artWorkMapper.updateEntityFromDto(artWork,entity);
        return artWorkMapper.toResponseDto(this.crudArtWorkRepository.save(entity));
    }

}

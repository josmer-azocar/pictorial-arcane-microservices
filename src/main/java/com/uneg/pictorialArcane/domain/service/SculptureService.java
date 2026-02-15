package com.uneg.pictorialArcane.domain.service;

import com.uneg.pictorialArcane.domain.dto.request.SculptureRequestDto;
import com.uneg.pictorialArcane.domain.dto.response.ArtWorkResponseDto;
import com.uneg.pictorialArcane.domain.dto.response.SculptureResponseDto;
import com.uneg.pictorialArcane.persistence.crud_repository.CrudArtWorkRepository;
import com.uneg.pictorialArcane.persistence.entity.ArtWorkEntity;
import com.uneg.pictorialArcane.persistence.entity.SculptureEntity;
import com.uneg.pictorialArcane.persistence.impl_repository.ArtWorkRespository;
import com.uneg.pictorialArcane.persistence.impl_repository.SculptureRepository;
import org.springframework.stereotype.Service;

@Service
public class SculptureService {

    private final SculptureRepository sculptureRepository;
    private final ArtWorkRespository artWorkRespository;
    private final CrudArtWorkRepository crudArtWorkRepository;

    public SculptureService(SculptureRepository sculptureRepository, ArtWorkRespository artWorkRespository, CrudArtWorkRepository crudArtWorkRepository) {
        this.sculptureRepository = sculptureRepository;
        this.artWorkRespository = artWorkRespository;
        this.crudArtWorkRepository = crudArtWorkRepository;
    }

    public SculptureResponseDto createSculpture(SculptureRequestDto sculptureRequest) {
        this.artWorkRespository.getArtWorkById(sculptureRequest.idArtWork());
        ArtWorkEntity artWorkEntity = this.crudArtWorkRepository.findFirstByIdArtWork(sculptureRequest.idArtWork());
        SculptureEntity sculptureEntity = this.sculptureRepository.getMapper().toEntity(sculptureRequest);
        sculptureEntity.setArtWork(artWorkEntity);
        return this.sculptureRepository.save(sculptureEntity);
    }
}

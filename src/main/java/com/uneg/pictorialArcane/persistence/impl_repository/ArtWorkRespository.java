package com.uneg.pictorialArcane.persistence.impl_repository;

import com.uneg.pictorialArcane.domain.Enum.ArtWorkStatus;
import com.uneg.pictorialArcane.domain.dto.request.ArtWorkRequestDto;
import com.uneg.pictorialArcane.domain.dto.response.ArtWork2ResponseDto;
import com.uneg.pictorialArcane.domain.dto.response.ArtWorkResponseDto;
import com.uneg.pictorialArcane.domain.dto.update.UpdateArtWorkDto;
import com.uneg.pictorialArcane.domain.exception.ArtWorkDoesNotExistsException;
import com.uneg.pictorialArcane.persistence.crud_repository.CrudArtWorkRepository;
import com.uneg.pictorialArcane.persistence.entity.ArtWorkEntity;
import com.uneg.pictorialArcane.persistence.mapper.ArtWorkMapper;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Repository;


import java.time.LocalDate;
import java.util.List;

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

    public List<ArtWorkResponseDto> findAllArtWorks() {
        List<ArtWorkEntity> entities = (List<ArtWorkEntity>) this.crudArtWorkRepository.findAll();
        return this.artWorkMapper.toResponseDto(entities);
    }

    public ArtWorkResponseDto getArtWorkById(Long id) {
        if (this.crudArtWorkRepository.findFirstByIdArtWork(id) == null) throw new ArtWorkDoesNotExistsException(id);

        return artWorkMapper.toResponseDto(this.crudArtWorkRepository.findFirstByIdArtWork(id));
    }

    public ArtWorkEntity getArtWorkEntityById(Long id) {
        ArtWorkEntity entity = this.crudArtWorkRepository.findFirstByIdArtWork(id);
        if (entity == null) {
            throw new ArtWorkDoesNotExistsException(id);
        }
        return entity;
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

    public Page<ArtWork2ResponseDto> filterArtWorks(Long idGenre, Long idArtist, String title, Double min, Double max, Pageable pageable) {
        Page<ArtWorkEntity> artWorksPage = crudArtWorkRepository.searchArtWorkByFilters(idGenre, idArtist, title, min, max, pageable);

        // Convertimos (Mapeamos) cada Obra a un DTO
        return artWorksPage.map(artWork -> new ArtWork2ResponseDto(
                artWork.getIdArtWork(),
                artWork.getName(),
                ArtWorkStatus.valueOf(artWork.getStatus().toUpperCase()),
                artWork.getPrice(),
                artWork.getArtist().getIdArtist(),
                artWork.getArtist().getName(),
                artWork.getGenre().getName(),
                artWork.getImageUrl()
        ));
    }

    public ArtWorkEntity saveEntity(ArtWorkEntity entity) {
        return this.crudArtWorkRepository.save(entity);
    }

    public Page<ArtWork2ResponseDto> findSoldArtWorksByDateRange(LocalDate startDate, LocalDate endDate, Pageable pageable) {
        Page<ArtWorkEntity> page = crudArtWorkRepository.findSoldArtWorksByDateRange(startDate,endDate,pageable);

        return page.map(artWork -> new ArtWork2ResponseDto(
                artWork.getIdArtWork(),
                artWork.getName(),
                ArtWorkStatus.valueOf(artWork.getStatus().toUpperCase()),
                artWork.getPrice(),
                artWork.getArtist().getIdArtist(),
                artWork.getArtist().getName(),
                artWork.getGenre().getName(),
                artWork.getImageUrl()
        ));
    }
}

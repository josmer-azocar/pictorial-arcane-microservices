package com.uneg.pictorialArcane.persistence.impl_repository;

import com.uneg.pictorialArcane.domain.dto.request.ContainerGoldsmithRequestDto;
import com.uneg.pictorialArcane.domain.dto.response.ContainerGoldsmithResponseDto;
import com.uneg.pictorialArcane.domain.exception.ArtistDoesNotExistsException;
import com.uneg.pictorialArcane.domain.exception.ArtWorkDoesNotExistsException;
import com.uneg.pictorialArcane.persistence.crud_repository.CrudArtistRepository;
import com.uneg.pictorialArcane.persistence.crud_repository.CrudGoldsmithRepository;
import com.uneg.pictorialArcane.persistence.entity.GoldsmithEntity;
import com.uneg.pictorialArcane.persistence.mapper.GoldsmithMapper;
import org.springframework.stereotype.Repository;

@Repository
public class GoldsmithRepository {

    private final CrudGoldsmithRepository crudGoldsmithRepository;
    private final CrudArtistRepository crudArtistRepository;
    private final GoldsmithMapper goldsmithMapper;

    public GoldsmithRepository(CrudGoldsmithRepository crudGoldsmithRepository, CrudArtistRepository crudArtistRepository, GoldsmithMapper goldsmithMapper) {
        this.crudGoldsmithRepository = crudGoldsmithRepository;
        this.crudArtistRepository = crudArtistRepository;
        this.goldsmithMapper = goldsmithMapper;
    }

    public ContainerGoldsmithResponseDto addGoldsmith(ContainerGoldsmithRequestDto dto){
        Long artistId = dto.artWorkRequest().idArtist();
        if (!this.crudArtistRepository.existsById(artistId)) {throw new ArtistDoesNotExistsException(artistId);}
        GoldsmithEntity entity = goldsmithMapper.toEntity(dto);
        GoldsmithEntity saved = this.crudGoldsmithRepository.save(entity);
        return goldsmithMapper.toContainerResponseDto(saved);
    }

    public ContainerGoldsmithResponseDto findByArtWorkId(Long artWorkId) {
        GoldsmithEntity entity = this.crudGoldsmithRepository.findFirstByIdArtWork(artWorkId)
                .orElseThrow(() -> new ArtWorkDoesNotExistsException(artWorkId));
        return goldsmithMapper.toContainerResponseDto(entity);
    }
}

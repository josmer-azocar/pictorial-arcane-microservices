package com.uneg.pictorialArcane.persistence.impl_repository;

import com.uneg.pictorialArcane.domain.dto.request.ArtistRequestDto;
import com.uneg.pictorialArcane.domain.dto.response.ArtWorkResponseDto;
import com.uneg.pictorialArcane.domain.dto.response.ArtistResponseDto;
import com.uneg.pictorialArcane.domain.dto.update.UpdateArtWorkDto;
import com.uneg.pictorialArcane.domain.dto.update.UpdateArtistDto;
import com.uneg.pictorialArcane.domain.exception.ArtWorkDoesNotExistsException;
import com.uneg.pictorialArcane.domain.exception.ArtistDoesNotExistsException;
import com.uneg.pictorialArcane.persistence.crud_repository.CrudArtistRepository;
import com.uneg.pictorialArcane.persistence.entity.ArtWorkEntity;
import com.uneg.pictorialArcane.persistence.entity.ArtistEntity;
import com.uneg.pictorialArcane.persistence.mapper.ArtistMapper;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public class ArtistRepository {

    private final CrudArtistRepository crudArtistRepository;
    private final ArtistMapper artistMapper;

    public ArtistRepository(CrudArtistRepository crudArtistRepository, ArtistMapper artistMapper) {
        this.crudArtistRepository = crudArtistRepository;
        this.artistMapper = artistMapper;
    }

    /*public ArtistResponseDto saveArtist(Long id, ArtistRequestDto artist) {
        ArtistEntity entity = this.crudArtistRepository.findFirstByIdArtist(id);
        return artistMapper.toResponseDto(this.crudArtistRepository.save(entity));
    }*/

    public ArtistResponseDto addArtist(ArtistRequestDto artist) {

        ArtistEntity entity = artistMapper.toEntity(artist);

        return artistMapper.toResponseDto(this.crudArtistRepository.save(entity));
    }

    public List<ArtistResponseDto> findAllArtist() {
        Iterable<ArtistEntity> entities = this.crudArtistRepository.findAll();
        return artistMapper.toResponseDto(entities);
    }

    public ArtistResponseDto getArtistById(Long id) {

        ArtistEntity entity = this.crudArtistRepository.findFirstByIdArtist(id);
        if (entity == null) {
            throw new ArtistDoesNotExistsException(id);
        }
        return artistMapper.toResponseDto(entity);
    }

    public void eraseArtistById(Long id) {
        this.crudArtistRepository.deleteById(id);
    }

    public ArtistResponseDto updateArtist(Long id, UpdateArtistDto artist){
        ArtistEntity entity = this.crudArtistRepository.findFirstByIdArtist(id);
        if(entity == null){ throw new ArtistDoesNotExistsException(id);}
        artistMapper.updateEntityFromDto(artist,entity);
        return artistMapper.toResponseDto(this.crudArtistRepository.save(entity));
    }
}

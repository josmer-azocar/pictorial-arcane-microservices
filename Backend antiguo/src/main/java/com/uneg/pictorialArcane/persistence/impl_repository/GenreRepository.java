package com.uneg.pictorialArcane.persistence.impl_repository;

import com.uneg.pictorialArcane.domain.dto.request.GenreRequestDto;
import com.uneg.pictorialArcane.domain.dto.response.GenreResponseDto;
import com.uneg.pictorialArcane.domain.dto.update.UpdateGenreDto;
import com.uneg.pictorialArcane.domain.exception.GenreDoesNotExistsException;
import com.uneg.pictorialArcane.persistence.crud_repository.CrudGenreRepository;
import com.uneg.pictorialArcane.persistence.entity.GenreEntity;
import com.uneg.pictorialArcane.persistence.mapper.GenreEntityMapper;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public class GenreRepository {

    private final CrudGenreRepository crudGenreRepository;
    private final GenreEntityMapper genreEntityMapper;

    public GenreRepository(CrudGenreRepository crudGenreRepository, GenreEntityMapper genreEntityMapper) {
        this.crudGenreRepository = crudGenreRepository;
        this.genreEntityMapper = genreEntityMapper;
    }

    public GenreResponseDto addGenre(GenreRequestDto genre) {
        GenreEntity entity = genreEntityMapper.toEntity(genre);
        return genreEntityMapper.toResponseDto(this.crudGenreRepository.save(entity));
    }

    public List<GenreResponseDto> findAllGenre() {
        Iterable<GenreEntity> entities = this.crudGenreRepository.findAll();
        return genreEntityMapper.toResponseDto(entities);
    }

    public GenreResponseDto getGenreById(Long id) {
        GenreEntity entity = this.crudGenreRepository.findFirstByIdGenre(id);
        if (entity == null) {
            throw new GenreDoesNotExistsException(id);
        }
        return genreEntityMapper.toResponseDto(entity);
    }

    public void eraseGenreById(Long id) {
        this.crudGenreRepository.deleteById(id);
    }

    public GenreResponseDto updateGenre(Long id, UpdateGenreDto genre) {
        GenreEntity entity = this.crudGenreRepository.findFirstByIdGenre(id);
        if (entity == null) {
            throw new GenreDoesNotExistsException(id);
        }
        genreEntityMapper.updateEntityFromDto(genre, entity);
        return genreEntityMapper.toResponseDto(this.crudGenreRepository.save(entity));
    }
}

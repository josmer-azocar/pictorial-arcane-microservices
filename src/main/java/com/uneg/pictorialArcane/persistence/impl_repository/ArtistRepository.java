package com.uneg.pictorialArcane.persistence.impl_repository;

import com.uneg.pictorialArcane.domain.dto.request.ArtistRequestDto;
import com.uneg.pictorialArcane.domain.dto.response.ArtistResponseDto;
import com.uneg.pictorialArcane.domain.dto.response.GenreResponseDto;
import com.uneg.pictorialArcane.domain.dto.update.UpdateArtistDto;
import com.uneg.pictorialArcane.domain.exception.ArtistAlreadyHasGenreException;
import com.uneg.pictorialArcane.domain.exception.ArtistDoesNotExistsException;
import com.uneg.pictorialArcane.domain.exception.ArtistDoesNotHaveGenreException;
import com.uneg.pictorialArcane.domain.exception.GenreDoesNotExistsException;
import com.uneg.pictorialArcane.persistence.crud_repository.CrudArtistRepository;
import com.uneg.pictorialArcane.persistence.crud_repository.CrudGenreRepository;
import com.uneg.pictorialArcane.persistence.entity.ArtistEntity;
import com.uneg.pictorialArcane.persistence.entity.GenreEntity;
import com.uneg.pictorialArcane.persistence.mapper.ArtistMapper;
import com.uneg.pictorialArcane.persistence.mapper.GenreEntityMapper;
import com.uneg.pictorialArcane.persistence.mapper.SimpleArtistMapper;
import org.springframework.stereotype.Repository;

import java.util.HashSet;
import java.util.List;

@Repository
public class ArtistRepository {

    private final CrudArtistRepository crudArtistRepository;
    private final CrudGenreRepository crudGenreRepository;
    private final ArtistMapper artistMapper;
    private final GenreEntityMapper genreEntityMapper;
    private final SimpleArtistMapper simpleArtistMapper;

    public ArtistRepository(CrudArtistRepository crudArtistRepository,
                            CrudGenreRepository crudGenreRepository,
                            ArtistMapper artistMapper,
                            GenreEntityMapper genreEntityMapper,
                            SimpleArtistMapper simpleArtistMapper) {
        this.crudArtistRepository = crudArtistRepository;
        this.crudGenreRepository = crudGenreRepository;
        this.artistMapper = artistMapper;
        this.genreEntityMapper = genreEntityMapper;
        this.simpleArtistMapper = simpleArtistMapper;
    }

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

    public ArtistResponseDto updateCommission(Long id, Double newRate) {
        ArtistEntity entity = this.crudArtistRepository.findFirstByIdArtist(id);
        if (entity == null) {
            throw new ArtistDoesNotExistsException(id);
        }
        entity.setCommissionRate(newRate);
        return artistMapper.toResponseDto(this.crudArtistRepository.save(entity));
    }

    public ArtistResponseDto assignGenreToArtist(Long idArtist, Long idGenre) {
        ArtistEntity artist = this.crudArtistRepository.findFirstByIdArtist(idArtist);
        if (artist == null) {
            throw new ArtistDoesNotExistsException(idArtist);
        }

        GenreEntity genre = this.crudGenreRepository.findFirstByIdGenre(idGenre);
        if (genre == null) {
            throw new GenreDoesNotExistsException(idGenre);
        }

        if (artist.getGenres() == null) {
            artist.setGenres(new HashSet<>());
        }

        if (artist.getGenres().contains(genre)) {
            throw new ArtistAlreadyHasGenreException(idArtist, idGenre);
        }

        artist.getGenres().add(genre);
        return this.artistMapper.toResponseDto(this.crudArtistRepository.save(artist));
    }

    public ArtistResponseDto unassignGenreFromArtist(Long idArtist, Long idGenre) {
        ArtistEntity artist = this.crudArtistRepository.findFirstByIdArtist(idArtist);
        if (artist == null) {
            throw new ArtistDoesNotExistsException(idArtist);
        }

        GenreEntity genre = this.crudGenreRepository.findFirstByIdGenre(idGenre);
        if (genre == null) {
            throw new GenreDoesNotExistsException(idGenre);
        }

        if (artist.getGenres() == null || !artist.getGenres().contains(genre)) {
            throw new ArtistDoesNotHaveGenreException(idArtist, idGenre);
        }

        artist.getGenres().remove(genre);
        return this.artistMapper.toResponseDto(this.crudArtistRepository.save(artist));
    }

    public List<GenreResponseDto> getGenresByArtistId(Long idArtist) {
        ArtistEntity artist = this.crudArtistRepository.findFirstByIdArtist(idArtist);
        if (artist == null) {
            throw new ArtistDoesNotExistsException(idArtist);
        }
        return this.genreEntityMapper.toResponseDto(artist.getGenres());
    }

    public List<ArtistResponseDto> getArtistsByGenreId(Long idGenre) {
        GenreEntity genre = this.crudGenreRepository.findFirstByIdGenre(idGenre);
        if (genre == null) {
            throw new GenreDoesNotExistsException(idGenre);
        }
        return this.simpleArtistMapper.toResponseDto(genre.getArtists());
    }
}

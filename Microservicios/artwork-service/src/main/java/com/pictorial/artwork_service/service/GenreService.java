package com.pictorial.artwork_service.service;

import com.pictorial.artwork_service.document.ArtistDocument;
import com.pictorial.artwork_service.document.GenreDocument;
import com.pictorial.artwork_service.dto.request.GenreRequestDto;
import com.pictorial.artwork_service.dto.request.UpdateGenreDto;
import com.pictorial.artwork_service.dto.response.ArtistResponseDto;
import com.pictorial.artwork_service.dto.response.GenreResponseDto;
import com.pictorial.artwork_service.exception.ArtistAlreadyHasGenreException;
import com.pictorial.artwork_service.exception.ArtistDoesNotHaveGenreException;
import com.pictorial.artwork_service.exception.DuplicateResourceException;
import com.pictorial.artwork_service.exception.ResourceNotFoundException;
import com.pictorial.artwork_service.mapper.ArtistMapper;
import com.pictorial.artwork_service.mapper.GenreMapper;
import com.pictorial.artwork_service.repository.ArtistRepository;
import com.pictorial.artwork_service.repository.GenreRepository;
import jakarta.validation.Valid;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;
import java.util.Set;

@Service
public class GenreService {

    private final GenreRepository genreRepository;
    private final GenreMapper genreMapper;
    private final ArtistRepository artistRepository;
    private final ArtistMapper artistMapper;

    public GenreService(GenreRepository genreRepository,
                        GenreMapper genreMapper,
                        ArtistRepository artistRepository,
                        ArtistMapper artistMapper) {
        this.genreRepository = genreRepository;
        this.genreMapper = genreMapper;
        this.artistRepository = artistRepository;
        this.artistMapper = artistMapper;
    }

    public GenreResponseDto create(GenreRequestDto dto) {
        if (dto == null) {
            throw new IllegalArgumentException("Genre request body cannot be null");
        }
        if (genreRepository.findByName(dto.name()).isPresent()) {
            throw new DuplicateResourceException("Genre with name '" + dto.name() + "' already exists");
        }
        return genreMapper.toResponseDto(genreRepository.save(genreMapper.toDocument(dto)));
    }

    public List<GenreResponseDto> getAll() {
        return genreMapper.toResponseDto(genreRepository.findAll());
    }

    public GenreResponseDto getById(String id) {
        if (id == null || id.isBlank()) {
            throw new IllegalArgumentException("Genre ID cannot be null or blank");
        }
        GenreDocument genre = genreRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("genre", "Genre not found"));
        return genreMapper.toResponseDto(genre);
    }

    public GenreResponseDto update(String id, @Valid UpdateGenreDto dto) {
        if (id == null || id.isBlank()) {
            throw new IllegalArgumentException("Genre ID cannot be null or blank");
        }
        if (dto == null) {
            throw new IllegalArgumentException("Genre update body cannot be null");
        }
        GenreDocument genre = genreRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("genre", "Genre not found"));
        genreRepository.findByName(dto.name()).ifPresent(existing -> {
            if (!existing.getId().equals(id)) {
                throw new DuplicateResourceException("Genre with name '" + dto.name() + "' already exists");
            }
        });
        genreMapper.updateDocumentFromDto(dto, genre);
        return genreMapper.toResponseDto(genreRepository.save(genre));
    }

    public void delete(String id) {
        if (id == null || id.isBlank()) {
            throw new IllegalArgumentException("Genre ID cannot be null or blank");
        }
        if (!genreRepository.existsById(id)) {
            throw new ResourceNotFoundException("genre", "Genre not found");
        }
        genreRepository.deleteById(id);
    }

    public void assignGenre(String idArtist, String idGenre) {
        if (idArtist == null || idArtist.isBlank()) {
            throw new IllegalArgumentException("Artist ID cannot be null or blank");
        }
        if (idGenre == null || idGenre.isBlank()) {
            throw new IllegalArgumentException("Genre ID cannot be null or blank");
        }
        ArtistDocument artist = artistRepository.findById(idArtist)
                .orElseThrow(() -> new ResourceNotFoundException("artist", "Artist not found"));
        GenreDocument genre = genreRepository.findById(idGenre)
                .orElseThrow(() -> new ResourceNotFoundException("genre", "Genre not found"));

        Set<GenreDocument> genres = artist.getGenres();
        if (genres == null) {
            genres = new java.util.HashSet<>();
            artist.setGenres(genres);
        }
        if (hasGenre(genres, idGenre)) {
            throw new ArtistAlreadyHasGenreException("Artist already has this genre");
        }
        artist.getGenres().add(genre);
        artistRepository.save(artist);
    }

    public void unassignGenre(String idArtist, String idGenre) {
        if (idArtist == null || idArtist.isBlank()) {
            throw new IllegalArgumentException("Artist ID cannot be null or blank");
        }
        if (idGenre == null || idGenre.isBlank()) {
            throw new IllegalArgumentException("Genre ID cannot be null or blank");
        }
        ArtistDocument artist = artistRepository.findById(idArtist)
                .orElseThrow(() -> new ResourceNotFoundException("artist", "Artist not found"));
        GenreDocument genre = genreRepository.findById(idGenre)
                .orElseThrow(() -> new ResourceNotFoundException("genre", "Genre not found"));

        Set<GenreDocument> genres = artist.getGenres();
        if (genres == null || !hasGenre(genres, idGenre)) {
            throw new ArtistDoesNotHaveGenreException("Artist does not have this genre");
        }
        artist.getGenres().removeIf(g -> g.getId() != null && g.getId().equals(idGenre));
        artistRepository.save(artist);
    }

    // La identidad de un género se determina por su id, no por la igualdad de Lombok @Data
    // (que compara todos los campos, incluidos timestamps mutables).
    private boolean hasGenre(Set<GenreDocument> genres, String idGenre) {
        return genres.stream().anyMatch(g -> g.getId() != null && g.getId().equals(idGenre));
    }

    public List<GenreResponseDto> getGenresByArtistId(String idArtist) {
        if (idArtist == null || idArtist.isBlank()) {
            throw new IllegalArgumentException("Artist ID cannot be null or blank");
        }
        ArtistDocument artist = artistRepository.findById(idArtist)
                .orElseThrow(() -> new ResourceNotFoundException("artist", "Artist not found"));
        Set<GenreDocument> genres = artist.getGenres();
        if (genres == null || genres.isEmpty()) {
            return List.of();
        }
        return genreMapper.toResponseDto(genres);
    }

    public List<ArtistResponseDto> getArtistsByGenreId(String idGenre) {
        if (idGenre == null || idGenre.isBlank()) {
            throw new IllegalArgumentException("Genre ID cannot be null or blank");
        }
        GenreDocument genre = genreRepository.findById(idGenre)
                .orElseThrow(() -> new ResourceNotFoundException("genre", "Genre not found"));
        
        List<ArtistDocument> artists = artistRepository.findByGenresId(idGenre);
        return artistMapper.toResponseDto(artists);
    }
}

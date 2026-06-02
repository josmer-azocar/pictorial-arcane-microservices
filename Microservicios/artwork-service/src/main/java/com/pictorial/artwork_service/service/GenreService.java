package com.pictorial.artwork_service.service;

import com.pictorial.artwork_service.document.ArtistDocument;
import com.pictorial.artwork_service.document.GenreDocument;
import com.pictorial.artwork_service.dto.request.GenreRequestDto;
import com.pictorial.artwork_service.dto.request.UpdateGenreDto;
import com.pictorial.artwork_service.dto.response.ArtistResponseDto;
import com.pictorial.artwork_service.dto.response.GenreResponseDto;
import com.pictorial.artwork_service.exception.ArtistAlreadyHasGenreException;
import com.pictorial.artwork_service.exception.ArtistDoesNotHaveGenreException;
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
        return genreMapper.toResponseDto(genreRepository.save(genreMapper.toDocument(dto)));
    }

    public List<GenreResponseDto> getAll() {
        return genreMapper.toResponseDto(genreRepository.findAll());
    }

    public GenreResponseDto getById(String id) {
        GenreDocument genre = genreRepository.findById(id).orElse(null);
        return genreMapper.toResponseDto(genre);
    }

    public GenreResponseDto update(String id, @Valid UpdateGenreDto dto) {
        GenreDocument genre = genreRepository.findById(id).orElse(null);
        genreMapper.updateDocumentFromDto(dto, genre);
        return genreMapper.toResponseDto(genreRepository.save(genre));
    }

    public void delete(String id) {
        genreRepository.deleteById(id);
    }

    public void assignGenre(String idArtist, String idGenre) {
        ArtistDocument artist = artistRepository.findById(idArtist)
                .orElseThrow(() -> new ResourceNotFoundException("artist", "Artist not found"));
        GenreDocument genre = genreRepository.findById(idGenre)
                .orElseThrow(() -> new ResourceNotFoundException("genre", "Genre not found"));

        Set<GenreDocument> genres = artist.getGenres();
        if (genres != null && genres.contains(genre)) {
            throw new ArtistAlreadyHasGenreException("Artist already has this genre");
        }
        artist.getGenres().add(genre);
        artistRepository.save(artist);
    }

    public void unassignGenre(String idArtist, String idGenre) {
        ArtistDocument artist = artistRepository.findById(idArtist)
                .orElseThrow(() -> new ResourceNotFoundException("artist", "Artist not found"));
        GenreDocument genre = genreRepository.findById(idGenre)
                .orElseThrow(() -> new ResourceNotFoundException("genre", "Genre not found"));

        Set<GenreDocument> genres = artist.getGenres();
        if (genres == null || !genres.contains(genre)) {
            throw new ArtistDoesNotHaveGenreException("Artist does not have this genre");
        }
        artist.getGenres().remove(genre);
        artistRepository.save(artist);
    }

    public List<GenreResponseDto> getGenresByArtistId(String idArtist) {
        ArtistDocument artist = artistRepository.findById(idArtist)
                .orElseThrow(() -> new ResourceNotFoundException("artist", "Artist not found"));
        Set<GenreDocument> genres = artist.getGenres();
        if (genres == null || genres.isEmpty()) {
            return List.of();
        }
        return genreMapper.toResponseDto(genres);
    }

    public List<ArtistResponseDto> getArtistsByGenreId(String idGenre) {
        GenreDocument genre = genreRepository.findById(idGenre)
                .orElseThrow(() -> new ResourceNotFoundException("genre", "Genre not found"));
        List<ArtistResponseDto> response = new ArrayList<>();
        for (ArtistDocument artist : artistRepository.findAll()) {
            Set<GenreDocument> genres = artist.getGenres();
            if (genres != null && genres.contains(genre)) {
                response.add(artistMapper.toResponseDto(artist));
            }
        }
        return response;
    }
}

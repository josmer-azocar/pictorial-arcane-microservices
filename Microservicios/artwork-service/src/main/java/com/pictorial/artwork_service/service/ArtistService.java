package com.pictorial.artwork_service.service;

import com.pictorial.artwork_service.document.ArtistDocument;
import com.pictorial.artwork_service.document.GenreDocument;
import com.pictorial.artwork_service.dto.request.ArtistRequestDto;
import com.pictorial.artwork_service.dto.request.UpdateArtistDto;
import com.pictorial.artwork_service.dto.response.ArtistResponseDto;
import com.pictorial.artwork_service.dto.response.GenreResponseDto;
import com.pictorial.artwork_service.exception.ArtistAlreadyHasGenreException;
import com.pictorial.artwork_service.exception.ArtistDoesNotHaveGenreException;
import com.pictorial.artwork_service.exception.ResourceNotFoundException;
import com.pictorial.artwork_service.mapper.ArtistMapper;
import com.pictorial.artwork_service.mapper.GenreMapper;
import com.pictorial.artwork_service.repository.ArtistRepository;
import com.pictorial.artwork_service.repository.GenreRepository;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Set;

@Service
public class ArtistService {

    private final ArtistRepository artistRepository;
    private final GenreRepository genreRepository;
    private final ArtistMapper artistMapper;
    private final GenreMapper genreMapper;

    public ArtistService(ArtistRepository artistRepository, GenreRepository genreRepository,
                         ArtistMapper artistMapper, GenreMapper genreMapper) {
        this.artistRepository = artistRepository;
        this.genreRepository = genreRepository;
        this.artistMapper = artistMapper;
        this.genreMapper = genreMapper;
    }

    public List<ArtistResponseDto> getAll() {
        return artistRepository.findAll()
                .stream()
                .map(artistMapper::toResponseDto)
                .toList();
    }

    public ArtistResponseDto getById(String id) {
        ArtistDocument document = artistRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("artist", "Artist not found with id: " + id));
        return artistMapper.toResponseDto(document);
    }

    public ArtistResponseDto create(ArtistRequestDto dto) {
        ArtistDocument document = artistMapper.toDocument(dto);
        document.setCreatedAt(LocalDateTime.now());
        document.setModifiedAt(LocalDateTime.now());
        ArtistDocument saved = artistRepository.save(document);
        return artistMapper.toResponseDto(saved);
    }

    public ArtistResponseDto update(String id, UpdateArtistDto dto) {
        ArtistDocument document = artistRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("artist", "Artist not found with id: " + id));
        artistMapper.updateDocumentFromDto(dto, document);
        document.setModifiedAt(LocalDateTime.now());
        ArtistDocument saved = artistRepository.save(document);
        return artistMapper.toResponseDto(saved);
    }

    public void delete(String id) {
        if (!artistRepository.existsById(id)) {
            throw new ResourceNotFoundException("artist", "Artist not found with id: " + id);
        }
        artistRepository.deleteById(id);
    }

    public ArtistResponseDto assignGenre(String artistId, String genreId) {
        ArtistDocument artist = artistRepository.findById(artistId)
                .orElseThrow(() -> new ResourceNotFoundException("artist", "Artist not found with id: " + artistId));
        GenreDocument genre = genreRepository.findById(genreId)
                .orElseThrow(() -> new ResourceNotFoundException("genre", "Genre not found with id: " + genreId));

        if (artist.getGenreIds().contains(genreId)) {
            throw new ArtistAlreadyHasGenreException("Artist already has genre: " + genre.getName());
        }

        artist.getGenreIds().add(genreId);
        artist.setModifiedAt(LocalDateTime.now());
        ArtistDocument saved = artistRepository.save(artist);
        return artistMapper.toResponseDto(saved);
    }

    public ArtistResponseDto unassignGenre(String artistId, String genreId) {
        ArtistDocument artist = artistRepository.findById(artistId)
                .orElseThrow(() -> new ResourceNotFoundException("artist", "Artist not found with id: " + artistId));

        if (!artist.getGenreIds().contains(genreId)) {
            throw new ArtistDoesNotHaveGenreException("Artist does not have genre with id: " + genreId);
        }

        artist.getGenreIds().remove(genreId);
        artist.setModifiedAt(LocalDateTime.now());
        ArtistDocument saved = artistRepository.save(artist);
        return artistMapper.toResponseDto(saved);
    }

    public List<GenreResponseDto> getGenresByArtistId(String artistId) {
        ArtistDocument artist = artistRepository.findById(artistId)
                .orElseThrow(() -> new ResourceNotFoundException("artist", "Artist not found with id: " + artistId));
        Set<String> genreIds = artist.getGenreIds();
        return genreRepository.findAllById(genreIds)
                .stream()
                .map(genreMapper::toResponseDto)
                .toList();
    }

    public List<ArtistResponseDto> getArtistsByGenreId(String genreId) {
        return artistRepository.findByGenreIdsContains(genreId)
                .stream()
                .map(artistMapper::toResponseDto)
                .toList();
    }
}

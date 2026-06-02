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
import jakarta.validation.Valid;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Set;

@Service
public class ArtistService {
    private final ArtistRepository artistRepository;
    private final ArtistMapper artistMapper;

    public ArtistService(ArtistRepository artistRepository, ArtistMapper artistMapper) {
        this.artistRepository = artistRepository;
        this.artistMapper = artistMapper;
    }

    public ArtistResponseDto create( ArtistRequestDto dto) {
         return artistMapper.toResponseDto(artistRepository.save(artistMapper.toDocument(dto)));
    }

    public List<ArtistResponseDto> getAll() {
        return artistMapper.toResponseDto(artistRepository.findAll());
    }

    public ArtistResponseDto getById(String id) {
        ArtistDocument artist = artistRepository.findById(id).orElse(null);
        return artistMapper.toResponseDto(artist);
    }

    public ArtistResponseDto update(String id, @Valid UpdateArtistDto dto) {
            ArtistDocument artist = artistRepository.findById(id).orElse(null);
            artistMapper.updateDocumentFromDto(dto,artist);
            return artistMapper.toResponseDto(artistRepository.save(artist));
    }

    public void delete(String id) {
        artistRepository.deleteById(id);
    }
}

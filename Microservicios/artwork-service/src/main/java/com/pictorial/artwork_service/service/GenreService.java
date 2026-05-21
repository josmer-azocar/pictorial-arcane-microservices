package com.pictorial.artwork_service.service;

import com.pictorial.artwork_service.document.GenreDocument;
import com.pictorial.artwork_service.dto.request.GenreRequestDto;
import com.pictorial.artwork_service.dto.request.UpdateGenreDto;
import com.pictorial.artwork_service.dto.response.GenreResponseDto;
import com.pictorial.artwork_service.exception.DuplicateResourceException;
import com.pictorial.artwork_service.exception.ResourceNotFoundException;
import com.pictorial.artwork_service.mapper.GenreMapper;
import com.pictorial.artwork_service.repository.GenreRepository;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;

@Service
public class GenreService {

    private final GenreRepository genreRepository;
    private final GenreMapper genreMapper;

    public GenreService(GenreRepository genreRepository, GenreMapper genreMapper) {
        this.genreRepository = genreRepository;
        this.genreMapper = genreMapper;
    }

    public List<GenreResponseDto> getAll() {
        return genreRepository.findAll()
                .stream()
                .map(genreMapper::toResponseDto)
                .toList();
    }

    public GenreResponseDto getById(String id) {
        GenreDocument document = genreRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("genre", "Genre not found with id: " + id));
        return genreMapper.toResponseDto(document);
    }

    public GenreResponseDto create(GenreRequestDto dto) {
        if (genreRepository.findByName(dto.name()).isPresent()) {
            throw new DuplicateResourceException("Genre already exists with name: " + dto.name());
        }
        GenreDocument document = genreMapper.toDocument(dto);
        document.setCreatedAt(LocalDateTime.now());
        document.setModifiedAt(LocalDateTime.now());
        GenreDocument saved = genreRepository.save(document);
        return genreMapper.toResponseDto(saved);
    }

    public GenreResponseDto update(String id, UpdateGenreDto dto) {
        GenreDocument document = genreRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("genre", "Genre not found with id: " + id));
        genreMapper.updateDocumentFromDto(dto, document);
        document.setModifiedAt(LocalDateTime.now());
        GenreDocument saved = genreRepository.save(document);
        return genreMapper.toResponseDto(saved);
    }

    public void delete(String id) {
        if (!genreRepository.existsById(id)) {
            throw new ResourceNotFoundException("genre", "Genre not found with id: " + id);
        }
        genreRepository.deleteById(id);
    }
}

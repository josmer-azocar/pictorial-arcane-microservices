package com.uneg.pictorialArcane.domain.service;


import com.uneg.pictorialArcane.domain.dto.request.GenreRequestDto;
import com.uneg.pictorialArcane.domain.dto.response.GenreResponseDto;
import com.uneg.pictorialArcane.domain.dto.update.UpdateGenreDto;
import com.uneg.pictorialArcane.persistence.impl_repository.GenreRepository;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class GenreService {

    private final GenreRepository genreRepository;
    public GenreService(GenreRepository genreRepository) {
        this.genreRepository = genreRepository;
    }

    public GenreResponseDto addGenre(GenreRequestDto genre) {
        return this.genreRepository.addGenre(genre);
    }

    public List<GenreResponseDto> getAllGenre() {
        return this.genreRepository.findAllGenre();
    }

    public GenreResponseDto getGenreById(Long id) {
        return this.genreRepository.getGenreById(id);
    }

    public void deleteGenreById(Long id) {
        this.genreRepository.getGenreById(id);
        this.genreRepository.eraseGenreById(id);
    }

    public GenreResponseDto updateGenre(Long id, UpdateGenreDto genre){
        return this.genreRepository.updateGenre(id, genre);
    }
}

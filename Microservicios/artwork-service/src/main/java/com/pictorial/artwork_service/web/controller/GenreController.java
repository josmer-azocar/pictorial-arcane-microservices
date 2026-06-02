package com.pictorial.artwork_service.web.controller;

import com.pictorial.artwork_service.dto.request.GenreRequestDto;
import com.pictorial.artwork_service.dto.request.UpdateGenreDto;
import com.pictorial.artwork_service.dto.response.ArtistResponseDto;
import com.pictorial.artwork_service.dto.response.GenreResponseDto;
import com.pictorial.artwork_service.service.GenreService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/genre")
public class GenreController {

    private final GenreService genreService;

    public GenreController(GenreService genreService) {
        this.genreService = genreService;
    }

    @GetMapping("/all")
    public ResponseEntity<List<GenreResponseDto>> getAll() {
        return ResponseEntity.ok(genreService.getAll());
    }

    @PostMapping("/add")
    public ResponseEntity<GenreResponseDto> create(@RequestBody @Valid GenreRequestDto dto) {
        return ResponseEntity.status(HttpStatus.CREATED).body(genreService.create(dto));
    }

    @GetMapping("/{id}")
    public ResponseEntity<GenreResponseDto> getById(@PathVariable String id) {
        return ResponseEntity.ok(genreService.getById(id));
    }

    @PutMapping("/update/{id}")
    public ResponseEntity<GenreResponseDto> update(@PathVariable String id,
                                                   @RequestBody @Valid UpdateGenreDto dto) {
        return ResponseEntity.ok(genreService.update(id, dto));
    }

    @DeleteMapping("/delete/{id}")
    public ResponseEntity<Void> delete(@PathVariable String id) {
        genreService.delete(id);
        return ResponseEntity.noContent().build();
    }

    @PostMapping("/assign")
    public ResponseEntity<Void> assignGenreToArtist(
            @RequestParam String idArtist,
            @RequestParam String idGenre) {
        genreService.assignGenre(idArtist, idGenre);
        return ResponseEntity.ok().build();
    }

    @DeleteMapping("/unassign")
    public ResponseEntity<Void> unassignGenreFromArtist(
            @RequestParam String idArtist,
            @RequestParam String idGenre) {
        genreService.unassignGenre(idArtist, idGenre);
        return ResponseEntity.ok().build();
    }

    @GetMapping("/getAllByArtist")
    public ResponseEntity<List<GenreResponseDto>> getGenresByArtistId(
            @RequestParam String idArtist) {
        return ResponseEntity.ok(genreService.getGenresByArtistId(idArtist));
    }

    @GetMapping("/getAllArtistsByGenre")
    public ResponseEntity<List<ArtistResponseDto>> getArtistsByGenreId(
            @RequestParam String idGenre) {
        return ResponseEntity.ok(genreService.getArtistsByGenreId(idGenre));
    }
}

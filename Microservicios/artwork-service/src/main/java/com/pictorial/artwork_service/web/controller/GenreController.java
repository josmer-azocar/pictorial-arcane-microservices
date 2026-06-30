package com.pictorial.artwork_service.web.controller;

import com.pictorial.artwork_service.dto.request.GenreRequestDto;
import com.pictorial.artwork_service.dto.request.UpdateGenreDto;
import com.pictorial.artwork_service.dto.response.ArtistResponseDto;
import com.pictorial.artwork_service.dto.response.GenreResponseDto;
import com.pictorial.artwork_service.service.GenreService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/genre")
public class GenreController {

    private final GenreService genreService;

    public GenreController(GenreService genreService) {
        this.genreService = genreService;
    }

    @PreAuthorize("permitAll()")
    @GetMapping("/all")
    public ResponseEntity<List<GenreResponseDto>> getAll() {
        return ResponseEntity.ok(genreService.getAll());
    }

    @PreAuthorize("hasRole('ADMIN')")
    @PostMapping("/add")
    public ResponseEntity<GenreResponseDto> create(@RequestBody @Valid GenreRequestDto dto) {
        return ResponseEntity.status(HttpStatus.CREATED).body(genreService.create(dto));
    }

    @PreAuthorize("permitAll()")
    @GetMapping("/{id}")
    public ResponseEntity<GenreResponseDto> getById(@PathVariable String id) {
        return ResponseEntity.ok(genreService.getById(id));
    }

    @PreAuthorize("hasRole('ADMIN')")
    @PutMapping("/update/{id}")
    public ResponseEntity<GenreResponseDto> update(@PathVariable String id,
                                                   @RequestBody @Valid UpdateGenreDto dto) {
        return ResponseEntity.ok(genreService.update(id, dto));
    }

    @PreAuthorize("hasRole('ADMIN')")
    @DeleteMapping("/delete/{id}")
    public ResponseEntity<Void> delete(@PathVariable String id) {
        genreService.delete(id);
        return ResponseEntity.noContent().build();
    }

    @PreAuthorize("hasRole('ADMIN')")
    @PostMapping("/assign")
    public ResponseEntity<Void> assignGenreToArtist(
            @RequestParam String idArtist,
            @RequestParam String idGenre) {
        genreService.assignGenre(idArtist, idGenre);
        return ResponseEntity.ok().build();
    }

    @PreAuthorize("hasRole('ADMIN')")
    @DeleteMapping("/unassign")
    public ResponseEntity<Void> unassignGenreFromArtist(
            @RequestParam String idArtist,
            @RequestParam String idGenre) {
        genreService.unassignGenre(idArtist, idGenre);
        return ResponseEntity.ok().build();
    }

    @PreAuthorize("permitAll()")
    @GetMapping("/getAllByArtist")
    public ResponseEntity<List<GenreResponseDto>> getGenresByArtistId(
            @RequestParam String idArtist) {
        return ResponseEntity.ok(genreService.getGenresByArtistId(idArtist));
    }

    @PreAuthorize("permitAll()")
    @GetMapping("/getAllArtistsByGenre")
    public ResponseEntity<List<ArtistResponseDto>> getArtistsByGenreId(
            @RequestParam String idGenre) {
        return ResponseEntity.ok(genreService.getArtistsByGenreId(idGenre));
    }
}

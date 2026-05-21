package com.pictorial.artwork_service.web.controller;

import com.pictorial.artwork_service.dto.request.ArtistRequestDto;
import com.pictorial.artwork_service.dto.request.UpdateArtistDto;
import com.pictorial.artwork_service.dto.response.ArtistResponseDto;
import com.pictorial.artwork_service.service.ArtistService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/artist")
public class ArtistController {

    private final ArtistService artistService;

    public ArtistController(ArtistService artistService) {
        this.artistService = artistService;
    }

    @PostMapping("/add")
    public ResponseEntity<ArtistResponseDto> create(@RequestBody @Valid ArtistRequestDto dto) {
        return ResponseEntity.status(HttpStatus.CREATED).body(artistService.create(dto));
    }

    @GetMapping("/all")
    public ResponseEntity<List<ArtistResponseDto>> getAll() {
        return ResponseEntity.ok(artistService.getAll());
    }

    @GetMapping("/{id}")
    public ResponseEntity<ArtistResponseDto> getById(@PathVariable String id) {
        return ResponseEntity.ok(artistService.getById(id));
    }

    @PutMapping("/update/{id}")
    public ResponseEntity<ArtistResponseDto> update(@PathVariable String id,
                                                    @RequestBody @Valid UpdateArtistDto dto) {
        return ResponseEntity.ok(artistService.update(id, dto));
    }

    @DeleteMapping("/delete/{id}")
    public ResponseEntity<Void> delete(@PathVariable String id) {
        artistService.delete(id);
        return ResponseEntity.noContent().build();
    }
}

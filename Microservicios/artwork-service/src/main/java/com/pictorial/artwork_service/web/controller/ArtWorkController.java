package com.pictorial.artwork_service.web.controller;

import com.pictorial.artwork_service.dto.request.*;
import com.pictorial.artwork_service.dto.response.*;
import com.pictorial.artwork_service.service.ArtWorkService;
import jakarta.validation.Valid;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Sort;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/artwork")
public class ArtWorkController {

    private final ArtWorkService artWorkService;

    public ArtWorkController(ArtWorkService artWorkService) {
        this.artWorkService = artWorkService;
    }

    @PostMapping("/addArtWork")
    public ResponseEntity<ArtWorkResponseDto> create(@RequestBody @Valid ArtWorkRequestDto dto) {
        return ResponseEntity.status(HttpStatus.CREATED).body(artWorkService.create(dto));
    }

    @GetMapping("/all")
    public ResponseEntity<List<ArtWorkResponseDto>> getAll() {
        return ResponseEntity.ok(artWorkService.getAll());
    }

    @GetMapping("/{id}")
    public ResponseEntity<ArtWorkResponseDto> getById(@PathVariable String id) {
        return ResponseEntity.ok(artWorkService.getById(id));
    }

    @PutMapping("/update/{id}")
    public ResponseEntity<ArtWorkResponseDto> update(@PathVariable String id,
                                                     @RequestBody @Valid UpdateArtWorkDto dto) {
        return ResponseEntity.ok(artWorkService.update(id, dto));
    }

    @DeleteMapping("/delete/{id}")
    public ResponseEntity<Void> delete(@PathVariable String id) {
        artWorkService.delete(id);
        return ResponseEntity.noContent().build();
    }

    @GetMapping("/search")
    public ResponseEntity<Page<ArtWorkResponseDto>> search(
            @RequestParam(required = false) String name,
            @RequestParam(required = false) String idArtist,
            @RequestParam(required = false) String idGenre,
            @RequestParam(required = false) Double minPrice,
            @RequestParam(required = false) Double maxPrice,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size,
            @RequestParam(defaultValue = "name") String sortBy,
            @RequestParam(defaultValue = "ASC") Sort.Direction direction) {
        return ResponseEntity.ok(
                artWorkService.filter(name, idArtist, idGenre, minPrice, maxPrice, page, size, sortBy, direction));
    }

    @PostMapping("/ceramic/add")
    public ResponseEntity<ContainerCeramicResponseDto> addCeramic(
            @RequestBody @Valid ContainerCeramicRequestDto dto) {
        return ResponseEntity.status(HttpStatus.CREATED).body(artWorkService.createCeramic(dto));
    }

    @PostMapping("/goldsmith/add")
    public ResponseEntity<ContainerGoldsmithResponseDto> addGoldsmith(
            @RequestBody @Valid ContainerGoldsmithRequestDto dto) {
        return ResponseEntity.status(HttpStatus.CREATED).body(artWorkService.createGoldsmith(dto));
    }

    @PostMapping("/painting/add")
    public ResponseEntity<ContainerPaintingResponseDto> addPainting(
            @RequestBody @Valid ContainerPaintingRequestDto dto) {
        return ResponseEntity.status(HttpStatus.CREATED).body(artWorkService.createPainting(dto));
    }

    @PostMapping("/photography/add")
    public ResponseEntity<ContainerPhotographyResponseDto> addPhotography(
            @RequestBody @Valid ContainerPhotographyRequestDto dto) {
        return ResponseEntity.status(HttpStatus.CREATED).body(artWorkService.createPhotography(dto));
    }

    @PostMapping("/sculpture/add")
    public ResponseEntity<ContainerSculptureResponseDto> addSculpture(
            @RequestBody @Valid ContainerSculptureRequestDto dto) {
        return ResponseEntity.status(HttpStatus.CREATED).body(artWorkService.createSculpture(dto));
    }

    @GetMapping("/search/specificArtWork/{id}")
    public ResponseEntity<?> getSpecificArtWork(@PathVariable String id) {
        return ResponseEntity.ok(artWorkService.getSpecificArtWork(id));
    }
}

package com.pictorial.artwork_service.web.controller;

import com.pictorial.artwork_service.dto.request.*;
import com.pictorial.artwork_service.dto.response.*;
import com.pictorial.artwork_service.service.ArtWorkService;
import com.pictorial.artwork_service.service.AzureBlobService;
import jakarta.validation.Valid;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Sort;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/artwork")
public class ArtWorkController {

    private final ArtWorkService artWorkService;
    private final AzureBlobService azureBlobService;

    public ArtWorkController(ArtWorkService artWorkService, AzureBlobService azureBlobService) {
        this.artWorkService = artWorkService;
        this.azureBlobService = azureBlobService;
    }

    @PreAuthorize("hasRole('ADMIN')")
    @PostMapping("/addArtWork")
    public ResponseEntity<ArtWorkResponseDto> create(@RequestBody @Valid ArtWorkRequestDto dto) {
        return ResponseEntity.status(HttpStatus.CREATED).body(artWorkService.create(dto));
    }

    // Público: cualquiera puede consultar las obras.
    @PreAuthorize("permitAll()")
    @GetMapping("/all")
    public ResponseEntity<Page<ArtWorkResponseDto>> getAll(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size,
            @RequestParam(defaultValue = "name") String sortBy,
            @RequestParam(defaultValue = "ASC") Sort.Direction direction) {
        return ResponseEntity.ok(artWorkService.getAll(page, size, sortBy, direction));
    }

    @PreAuthorize("permitAll()")
    @GetMapping("/{id}")
    public ResponseEntity<ArtWorkResponseDto> getById(@PathVariable String id) {
        return ResponseEntity.ok(artWorkService.getById(id));
    }

    @PreAuthorize("hasRole('ADMIN')")
    @PutMapping("/update/{id}")
    public ResponseEntity<ArtWorkResponseDto> update(@PathVariable String id,
                                                     @RequestBody @Valid UpdateArtWorkDto dto) {
        return ResponseEntity.ok(artWorkService.update(id, dto));
    }

    @PreAuthorize("hasRole('ADMIN')")
    @DeleteMapping("/delete/{id}")
    public ResponseEntity<Void> delete(@PathVariable String id) {
        artWorkService.delete(id);
        return ResponseEntity.noContent().build();
    }

    @PreAuthorize("permitAll()")
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

    @PreAuthorize("hasRole('ADMIN')")
    @PostMapping("/ceramic/add")
    public ResponseEntity<ContainerCeramicResponseDto> addCeramic(
            @RequestBody @Valid ContainerCeramicRequestDto dto) {
        return ResponseEntity.status(HttpStatus.CREATED).body(artWorkService.createCeramic(dto));
    }

    @PreAuthorize("hasRole('ADMIN')")
    @PostMapping("/goldsmith/add")
    public ResponseEntity<ContainerGoldsmithResponseDto> addGoldsmith(
            @RequestBody @Valid ContainerGoldsmithRequestDto dto) {
        return ResponseEntity.status(HttpStatus.CREATED).body(artWorkService.createGoldsmith(dto));
    }

    @PreAuthorize("hasRole('ADMIN')")
    @PostMapping("/painting/add")
    public ResponseEntity<ContainerPaintingResponseDto> addPainting(
            @RequestBody @Valid ContainerPaintingRequestDto dto) {
        return ResponseEntity.status(HttpStatus.CREATED).body(artWorkService.createPainting(dto));
    }

    @PreAuthorize("hasRole('ADMIN')")
    @PostMapping("/photography/add")
    public ResponseEntity<ContainerPhotographyResponseDto> addPhotography(
            @RequestBody @Valid ContainerPhotographyRequestDto dto) {
        return ResponseEntity.status(HttpStatus.CREATED).body(artWorkService.createPhotography(dto));
    }

    @PreAuthorize("hasRole('ADMIN')")
    @PostMapping("/sculpture/add")
    public ResponseEntity<ContainerSculptureResponseDto> addSculpture(
            @RequestBody @Valid ContainerSculptureRequestDto dto) {
        return ResponseEntity.status(HttpStatus.CREATED).body(artWorkService.createSculpture(dto));
    }

    @PreAuthorize("permitAll()")
    @GetMapping("/search/specificArtWork/{id}")
    public ResponseEntity<?> getSpecificArtWork(@PathVariable String id) {
        return ResponseEntity.ok(artWorkService.getSpecificArtWork(id));
    }

    // --- Transiciones de estado por clave de negocio (Long); invocadas internamente por core-service
    //     vía lb:// (sin token), por lo que deben permanecer accesibles sin autenticación. ---

    @PreAuthorize("permitAll()")
    @PostMapping("/reserve/{artworkId}")
    public ResponseEntity<ArtWorkResponseDto> reserve(@PathVariable Long artworkId,
                                                      @RequestParam Long changedBy,
                                                      @RequestParam(required = false) String reason) {
        return ResponseEntity.ok(artWorkService.reserve(artworkId, changedBy, reason));
    }

    @PreAuthorize("permitAll()")
    @PostMapping("/sell/{artworkId}")
    public ResponseEntity<ArtWorkResponseDto> sell(@PathVariable Long artworkId,
                                                   @RequestParam Long changedBy,
                                                   @RequestParam(required = false) String reason) {
        return ResponseEntity.ok(artWorkService.markSold(artworkId, changedBy, reason));
    }

    @PreAuthorize("permitAll()")
    @PostMapping("/release/{artworkId}")
    public ResponseEntity<ArtWorkResponseDto> release(@PathVariable Long artworkId,
                                                      @RequestParam Long changedBy,
                                                      @RequestParam(required = false) String reason) {
        return ResponseEntity.ok(artWorkService.release(artworkId, changedBy, reason));
    }

    @PreAuthorize("hasRole('ADMIN')")
    @PostMapping("/{id}/artworkImage")
    public ResponseEntity<?> uploadArtworkImage(@PathVariable String id,
                                                @RequestParam("file") MultipartFile file) {
        try {
            return ResponseEntity.ok(this.azureBlobService.uploadArtworkImage(id, file));
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.internalServerError().body("Error al subir la imagen: " + e.getMessage());
        }
    }

    @PreAuthorize("hasRole('ADMIN')")
    @DeleteMapping("/{id}/artworkImage")
    public ResponseEntity<?> deleteArtworkImage(@PathVariable String id) {
        try {
            return this.azureBlobService.deleteArtworkImage(id);
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.internalServerError().body(Map.of("error", "Error al procesar la solicitud: " + e.getMessage()));
        }
    }
}

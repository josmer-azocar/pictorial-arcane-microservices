package com.pictorial.artwork_service.web.controller;

import com.pictorial.artwork_service.dto.request.ArtistRequestDto;
import com.pictorial.artwork_service.dto.request.UpdateArtistDto;
import com.pictorial.artwork_service.dto.response.ArtistResponseDto;
import com.pictorial.artwork_service.service.ArtistService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;
import com.pictorial.artwork_service.service.AzureBlobService;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/artist")
public class ArtistController {

    private final ArtistService artistService;
    private final AzureBlobService azureBlobService;

    public ArtistController(ArtistService artistService, AzureBlobService azureBlobService) {
        this.artistService = artistService;
        this.azureBlobService = azureBlobService;
    }

    @PreAuthorize("hasRole('ADMIN')")
    @PostMapping("/add")
    public ResponseEntity<ArtistResponseDto> create(@RequestBody @Valid ArtistRequestDto dto) {
        return ResponseEntity.status(HttpStatus.CREATED).body(artistService.create(dto));
    }

    @PreAuthorize("permitAll()")
    @GetMapping("/all")
    public ResponseEntity<List<ArtistResponseDto>> getAll() {
        return ResponseEntity.ok(artistService.getAll());
    }

    @PreAuthorize("permitAll()")
    @GetMapping("/{id}")
    public ResponseEntity<ArtistResponseDto> getById(@PathVariable String id) {
        return ResponseEntity.ok(artistService.getById(id));
    }

    @PreAuthorize("hasRole('ADMIN')")
    @PutMapping("/update/{id}")
    public ResponseEntity<ArtistResponseDto> update(@PathVariable String id,
                                                    @RequestBody @Valid UpdateArtistDto dto) {
        return ResponseEntity.ok(artistService.update(id, dto));
    }

    @PreAuthorize("hasRole('ADMIN')")
    @DeleteMapping("/delete/{id}")
    public ResponseEntity<Void> delete(@PathVariable String id) {
        artistService.delete(id);
        return ResponseEntity.noContent().build();
    }

    @PreAuthorize("hasRole('ADMIN')")
    @PostMapping("/{id}/artistImage")
    public ResponseEntity<?> uploadArtistImage(@PathVariable String id,
                                               @RequestParam("file") MultipartFile file) {
        try {
            return ResponseEntity.ok(this.azureBlobService.uploadArtistImage(id, file));
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.internalServerError().body("Error al subir la imagen: " + e.getMessage());
        }
    }

    @PreAuthorize("hasRole('ADMIN')")
    @DeleteMapping("/{id}/artistImage")
    public ResponseEntity<?> deleteArtistImage(@PathVariable String id) {
        try {
            return this.azureBlobService.deleteArtistImage(id);
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.internalServerError().body(Map.of("error", "Error al procesar la solicitud: " + e.getMessage()));
        }
    }
}

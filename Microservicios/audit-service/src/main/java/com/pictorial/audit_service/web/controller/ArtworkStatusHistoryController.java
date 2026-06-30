package com.pictorial.audit_service.web.controller;

import com.pictorial.audit_service.dto.request.ArtworkStatusHistoryRequestDto;
import com.pictorial.audit_service.dto.response.ArtworkStatusHistoryResponseDto;
import com.pictorial.audit_service.service.ArtworkStatusHistoryService;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.time.Instant;
import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/artwork-status-history")
public class ArtworkStatusHistoryController {

    private final ArtworkStatusHistoryService service;

    public ArtworkStatusHistoryController(ArtworkStatusHistoryService service) {
        this.service = service;
    }

    // Escritura interna desde artwork-service (lb://, sin token): debe permanecer abierta.
    @PreAuthorize("permitAll()")
    @PostMapping("/add")
    public ResponseEntity<ArtworkStatusHistoryResponseDto> create(@RequestBody @Valid ArtworkStatusHistoryRequestDto dto) {
        return ResponseEntity.ok(service.create(dto));
    }

    @PreAuthorize("hasRole('ADMIN')")
    @GetMapping("/all")
    public ResponseEntity<List<ArtworkStatusHistoryResponseDto>> getAll() {
        return ResponseEntity.ok(service.getAll());
    }

    @PreAuthorize("hasRole('ADMIN')")
    @GetMapping("/artwork/{artworkId}")
    public ResponseEntity<List<ArtworkStatusHistoryResponseDto>> getByArtworkId(@PathVariable Long artworkId) {
        return ResponseEntity.ok(service.getByArtworkId(artworkId));
    }

    @PreAuthorize("hasRole('ADMIN')")
    @GetMapping("/find")
    public ResponseEntity<ArtworkStatusHistoryResponseDto> getById(
            @RequestParam Long artworkId,
            @RequestParam Instant changedAt,
            @RequestParam UUID changeId) {
        return ResponseEntity.ok(service.getById(artworkId, changedAt, changeId));
    }

    @PreAuthorize("hasRole('ADMIN')")
    @DeleteMapping("/delete")
    public ResponseEntity<Void> delete(
            @RequestParam Long artworkId,
            @RequestParam Instant changedAt,
            @RequestParam UUID changeId) {
        service.delete(artworkId, changedAt, changeId);
        return ResponseEntity.noContent().build();
    }
}

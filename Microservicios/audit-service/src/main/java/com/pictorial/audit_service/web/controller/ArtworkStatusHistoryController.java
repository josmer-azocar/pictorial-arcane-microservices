package com.pictorial.audit_service.web.controller;

import com.pictorial.audit_service.dto.request.ArtworkStatusHistoryRequestDto;
import com.pictorial.audit_service.dto.response.ArtworkStatusHistoryResponseDto;
import com.pictorial.audit_service.service.ArtworkStatusHistoryService;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
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

    @PostMapping("/add")
    public ResponseEntity<ArtworkStatusHistoryResponseDto> create(@RequestBody @Valid ArtworkStatusHistoryRequestDto dto) {
        return ResponseEntity.ok(service.create(dto));
    }

    @GetMapping("/all")
    public ResponseEntity<List<ArtworkStatusHistoryResponseDto>> getAll() {
        return ResponseEntity.ok(service.getAll());
    }

    @GetMapping("/artwork/{artworkId}")
    public ResponseEntity<List<ArtworkStatusHistoryResponseDto>> getByArtworkId(@PathVariable Long artworkId) {
        return ResponseEntity.ok(service.getByArtworkId(artworkId));
    }

    @GetMapping("/find")
    public ResponseEntity<ArtworkStatusHistoryResponseDto> getById(
            @RequestParam Long artworkId,
            @RequestParam Instant changedAt,
            @RequestParam UUID changeId) {
        return ResponseEntity.ok(service.getById(artworkId, changedAt, changeId));
    }

    @DeleteMapping("/delete")
    public ResponseEntity<Void> delete(
            @RequestParam Long artworkId,
            @RequestParam Instant changedAt,
            @RequestParam UUID changeId) {
        service.delete(artworkId, changedAt, changeId);
        return ResponseEntity.noContent().build();
    }
}

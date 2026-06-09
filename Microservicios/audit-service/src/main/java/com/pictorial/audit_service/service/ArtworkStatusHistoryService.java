package com.pictorial.audit_service.service;

import com.pictorial.audit_service.dto.request.ArtworkStatusHistoryRequestDto;
import com.pictorial.audit_service.dto.response.ArtworkStatusHistoryResponseDto;
import com.pictorial.audit_service.mapper.ArtworkStatusHistoryMapper;
import com.pictorial.audit_service.persistence.repository.ArtworkStatusHistoryRepository;
import com.pictorial.audit_service.persistence.tables.ArtworkStatusHistoryKey;
import com.pictorial.audit_service.persistence.tables.ArtworkStatusHistoryTable;
import org.springframework.stereotype.Service;

import java.time.Instant;
import java.util.List;
import java.util.UUID;

@Service
public class ArtworkStatusHistoryService {

    private final ArtworkStatusHistoryRepository repository;
    private final ArtworkStatusHistoryMapper mapper;

    public ArtworkStatusHistoryService(ArtworkStatusHistoryRepository repository, ArtworkStatusHistoryMapper mapper) {
        this.repository = repository;
        this.mapper = mapper;
    }

    public ArtworkStatusHistoryResponseDto create(ArtworkStatusHistoryRequestDto dto) {
        ArtworkStatusHistoryTable table = mapper.toTable(dto);
        ArtworkStatusHistoryTable saved = repository.save(table);
        return mapper.toResponseDto(saved);
    }

    public List<ArtworkStatusHistoryResponseDto> getAll() {
        List<ArtworkStatusHistoryTable> list = repository.findAll();
        return mapper.toResponseDtoList(list);
    }

    public List<ArtworkStatusHistoryResponseDto> getByArtworkId(Long artworkId) {
        List<ArtworkStatusHistoryTable> list = repository.findByKeyArtworkId(artworkId);
        return mapper.toResponseDtoList(list);
    }

    public ArtworkStatusHistoryResponseDto getById(Long artworkId, Instant changedAt, UUID changeId) {
        ArtworkStatusHistoryKey key = new ArtworkStatusHistoryKey(artworkId, changedAt, changeId);
        ArtworkStatusHistoryTable table = repository.findById(key).orElse(null);
        return mapper.toResponseDto(table);
    }

    public void delete(Long artworkId, Instant changedAt, UUID changeId) {
        ArtworkStatusHistoryKey key = new ArtworkStatusHistoryKey(artworkId, changedAt, changeId);
        repository.deleteById(key);
    }
}

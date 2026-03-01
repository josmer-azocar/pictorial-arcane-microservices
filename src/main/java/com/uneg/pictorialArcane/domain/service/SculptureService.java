package com.uneg.pictorialArcane.domain.service;

import com.uneg.pictorialArcane.domain.dto.request.ContainerSculptureRequestDto;
import com.uneg.pictorialArcane.domain.dto.response.ContainerSculptureResponseDto;
import com.uneg.pictorialArcane.persistence.impl_repository.SculptureRepository;
import jakarta.transaction.Transactional;
import org.springframework.stereotype.Service;

@Service
public class SculptureService {
    private final SculptureRepository sculptureRepository;

    public SculptureService(SculptureRepository sculptureRepository) {
        this.sculptureRepository = sculptureRepository;
    }

    @Transactional
    public ContainerSculptureResponseDto createSculpture(ContainerSculptureRequestDto dto) {
        return this.sculptureRepository.addSculpture(dto);
    }

    public ContainerSculptureResponseDto getByArtWorkId(Long artWorkId) {
        return this.sculptureRepository.findByArtWorkId(artWorkId);
    }
}

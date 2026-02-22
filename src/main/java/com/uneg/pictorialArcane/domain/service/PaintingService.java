package com.uneg.pictorialArcane.domain.service;

import com.uneg.pictorialArcane.domain.dto.request.ContainerPaintingRequestDto;
import com.uneg.pictorialArcane.domain.dto.response.ContainerPaintingResponseDto;
import com.uneg.pictorialArcane.persistence.impl_repository.PaintingRepository;
import jakarta.transaction.Transactional;
import org.springframework.stereotype.Service;

@Service
public class PaintingService {
    private final PaintingRepository paintingRepository;

    public PaintingService(PaintingRepository paintingRepository) {
        this.paintingRepository = paintingRepository;
    }

    @Transactional
    public ContainerPaintingResponseDto createPainting(ContainerPaintingRequestDto dto) {
        return this.paintingRepository.addPainting(dto);
    }
}

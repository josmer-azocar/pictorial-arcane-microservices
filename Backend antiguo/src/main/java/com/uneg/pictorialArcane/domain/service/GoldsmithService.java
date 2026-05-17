package com.uneg.pictorialArcane.domain.service;

import com.uneg.pictorialArcane.domain.dto.request.ContainerGoldsmithRequestDto;
import com.uneg.pictorialArcane.domain.dto.response.ContainerGoldsmithResponseDto;
import com.uneg.pictorialArcane.persistence.impl_repository.GoldsmithRepository;
import jakarta.transaction.Transactional;
import org.springframework.stereotype.Service;

@Service
public class GoldsmithService {
    private final GoldsmithRepository goldsmithRepository;

    public GoldsmithService(GoldsmithRepository goldsmithRepository) {
        this.goldsmithRepository = goldsmithRepository;
    }

    @Transactional
    public ContainerGoldsmithResponseDto createGoldsmith(ContainerGoldsmithRequestDto dto) {
        return this.goldsmithRepository.addGoldsmith(dto);
    }

    public ContainerGoldsmithResponseDto getByArtWorkId(Long artWorkId) {
        return this.goldsmithRepository.findByArtWorkId(artWorkId);
    }
}

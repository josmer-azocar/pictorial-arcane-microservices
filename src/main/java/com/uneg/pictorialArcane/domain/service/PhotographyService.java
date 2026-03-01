package com.uneg.pictorialArcane.domain.service;

import com.uneg.pictorialArcane.domain.dto.request.ContainerPhotographyRequestDto;
import com.uneg.pictorialArcane.domain.dto.response.ContainerPhotographyResponseDto;
import com.uneg.pictorialArcane.persistence.impl_repository.PhotographyRepository;
import jakarta.transaction.Transactional;
import org.springframework.stereotype.Service;

@Service
public class PhotographyService {

    private final PhotographyRepository photographyRepository;

    public PhotographyService(PhotographyRepository photographyRepository) {
        this.photographyRepository = photographyRepository;
    }

    @Transactional
    public ContainerPhotographyResponseDto createPhotography(ContainerPhotographyRequestDto dto) {
        return this.photographyRepository.addPhotography(dto);
    }

    public ContainerPhotographyResponseDto getByArtWorkId(Long artWorkId) {
        return this.photographyRepository.findByArtWorkId(artWorkId);
    }
}

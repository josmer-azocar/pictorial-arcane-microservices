package com.uneg.pictorialArcane.domain.service;

import com.uneg.pictorialArcane.domain.dto.request.ContainerCeramicRequestDto;
import com.uneg.pictorialArcane.domain.dto.response.ContainerCeramicResponseDto;
import com.uneg.pictorialArcane.persistence.impl_repository.CeramicRepository;
import jakarta.transaction.Transactional;
import org.springframework.stereotype.Service;

@Service
public class CeramicService {
    private final CeramicRepository ceramicRepository;

    public CeramicService(CeramicRepository ceramicRepository) {
        this.ceramicRepository = ceramicRepository;
    }


    @Transactional
    public ContainerCeramicResponseDto createCeramic(ContainerCeramicRequestDto dto) {
        return this.ceramicRepository.addCeramic(dto);
    }
}

package com.uneg.pictorialArcane.persistence.impl_repository;

import com.uneg.pictorialArcane.domain.dto.request.SculptureRequestDto;
import com.uneg.pictorialArcane.domain.dto.response.SculptureResponseDto;
import com.uneg.pictorialArcane.domain.exception.SculptureDoesNotExistsException;
import com.uneg.pictorialArcane.persistence.crud_repository.CrudSculptureRepository;
import com.uneg.pictorialArcane.persistence.entity.SculptureEntity;
import com.uneg.pictorialArcane.persistence.mapper.SculptureMapper;
import org.springframework.stereotype.Repository;

@Repository
public class SculptureRepository {

    private final CrudSculptureRepository crudSculptureRepository;
    private final SculptureMapper sculptureMapper;

    public SculptureRepository(CrudSculptureRepository crudSculptureRepository, SculptureMapper sculptureMapper) {
        this.crudSculptureRepository = crudSculptureRepository;
        this.sculptureMapper = sculptureMapper;
    }

    /**public SculptureResponseDto save(SculptureRequestDto request){
        SculptureEntity entity = sculptureMapper.toEntity(request);
        return sculptureMapper.toResponseDto(this.crudSculptureRepository.save(entity));
    }*/
    public SculptureResponseDto save(SculptureEntity entity){
        return sculptureMapper.toResponseDto(this.crudSculptureRepository.save(entity));
    }

    public SculptureEntity findSculptureById(Long id) {
        return crudSculptureRepository.findById(id)
                .orElseThrow(() -> new SculptureDoesNotExistsException(id));
    }

    public SculptureMapper getMapper() {
        return this.sculptureMapper;
    }
}

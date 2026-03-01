package com.uneg.pictorialArcane.persistence.impl_repository;

import com.uneg.pictorialArcane.domain.dto.request.GenderRequestDto;
import com.uneg.pictorialArcane.domain.dto.response.GenderResponseDto;
import com.uneg.pictorialArcane.domain.dto.update.UpdateGenderDto;
import com.uneg.pictorialArcane.domain.exception.GenderDoesNotExistsException;
import com.uneg.pictorialArcane.persistence.crud_repository.CrudGenderRepository;
import com.uneg.pictorialArcane.persistence.entity.GenderEntity;
import com.uneg.pictorialArcane.persistence.mapper.GenderEntityMapper;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public class GenderRepository {

    private final CrudGenderRepository crudGenderRepository;
    private final GenderEntityMapper genderEntityMapper;

    public GenderRepository(CrudGenderRepository crudGenderRepository, GenderEntityMapper genderEntityMapper) {
        this.crudGenderRepository = crudGenderRepository;
        this.genderEntityMapper = genderEntityMapper;
    }

    public GenderResponseDto addGender(GenderRequestDto gender) {
        GenderEntity entity = genderEntityMapper.toEntity(gender);
        return genderEntityMapper.toResponseDto(this.crudGenderRepository.save(entity));
    }

    public List<GenderResponseDto> findAllGender() {
        Iterable<GenderEntity> entities = this.crudGenderRepository.findAll();
        return genderEntityMapper.toResponseDto(entities);
    }

    public GenderResponseDto getGenderById(Long id) {
        GenderEntity entity = this.crudGenderRepository.findFirstByIdGender(id);
        if (entity == null) {
            throw new GenderDoesNotExistsException(id);
        }
        return genderEntityMapper.toResponseDto(entity);
    }

    public void eraseGenderById(Long id) {
        this.crudGenderRepository.deleteById(id);
    }

    public GenderResponseDto updateGender(Long id, UpdateGenderDto gender) {
        GenderEntity entity = this.crudGenderRepository.findFirstByIdGender(id);
        if (entity == null) {
            throw new GenderDoesNotExistsException(id);
        }
        genderEntityMapper.updateEntityFromDto(gender, entity);
        return genderEntityMapper.toResponseDto(this.crudGenderRepository.save(entity));
    }
}

package com.uneg.pictorialArcane.domain.service;


import com.uneg.pictorialArcane.domain.dto.request.GenderRequestDto;
import com.uneg.pictorialArcane.domain.dto.response.GenderResponseDto;
import com.uneg.pictorialArcane.domain.dto.update.UpdateGenderDto;
import com.uneg.pictorialArcane.persistence.impl_repository.GenderRepository;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class GenderService {

    private final GenderRepository genderRepository;
    public GenderService(GenderRepository genderRepository) {
        this.genderRepository = genderRepository;
    }

    public GenderResponseDto addGender(GenderRequestDto gender) {
        return this.genderRepository.addGender(gender);
    }

    public List<GenderResponseDto> getAllGender() {
        return genderRepository.findAllGender();
    }

    public GenderResponseDto getGenderById(Long id){
        return genderRepository.getGenderById(id);
    }

    public void deleteGenderById(Long id) {
        this.genderRepository.getGenderById(id);
        this.genderRepository.eraseGenderById(id);
    }

    public GenderResponseDto updateGender(Long id, UpdateGenderDto gender) {
        return this.genderRepository.updateGender(id, gender);
    }
}

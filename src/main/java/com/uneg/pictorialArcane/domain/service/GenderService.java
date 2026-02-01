package com.uneg.pictorialArcane.domain.service;


import com.uneg.pictorialArcane.persistence.entity.GenderEntity;
import com.uneg.pictorialArcane.persistence.impl_repository.GenderRepository;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class GenderService {

    private final GenderRepository genderRepository;
    public GenderService(GenderRepository genderRepository) {
        this.genderRepository = genderRepository;
    }

    public GenderEntity saveGender(GenderEntity gender) {
        return genderRepository.saveGender(gender);
    }

    public GenderEntity addGender(GenderEntity gender) {
        return this.genderRepository.addGender(gender);
    }

    public List<GenderEntity> getAllGender() {
        return genderRepository.findAllGender();
    }

    public GenderEntity getGenderById(Long id){
        return genderRepository.getGenderById(id).orElseThrow(() -> new RuntimeException("Artista " +
                "no encontrado ID: " + id));
    }

    public void deleteGenderById(Long id) {
        if (genderRepository.getGenderById(id).isPresent()){
            genderRepository.eraseGenderById(id);
        }else {
            throw new RuntimeException("No se puede eliminar el ID: " + id);
        }
    }

}

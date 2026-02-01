package com.uneg.pictorialArcane.persistence.impl_repository;

import com.uneg.pictorialArcane.persistence.crud_repository.CrudGenderRepository;
import com.uneg.pictorialArcane.persistence.entity.GenderEntity;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public class GenderRepository {

    private final CrudGenderRepository crudGenderRepository;

    public GenderRepository(CrudGenderRepository crudGenderRepository) {
        this.crudGenderRepository = crudGenderRepository;
    }

    public GenderEntity saveGender(GenderEntity gender) {
        return crudGenderRepository.save(gender);
    }

    public GenderEntity addGender(GenderEntity gender) {
        return this.crudGenderRepository.save(gender);
    }

    public List<GenderEntity> findAllGender() {
        return (List<GenderEntity>) this.crudGenderRepository.findAll();
    }

    public Optional<GenderEntity> getGenderById(Long id) {
        return this.crudGenderRepository.findById(id);
    }

    public void eraseGenderById(Long id) {
        this.crudGenderRepository.deleteById(id);
    }
}

package com.uneg.pictorialArcane.persistence.impl_repository;

import com.uneg.pictorialArcane.persistence.crud_repository.CrudArtWorkRepository;
import com.uneg.pictorialArcane.persistence.entity.ArtWorkEntity;
import org.springframework.stereotype.Repository;


import java.util.List;
import java.util.Optional;

@Repository
public class ArtWorkRespository {

    private final CrudArtWorkRepository crudArtWorkRepository;

    public ArtWorkRespository(CrudArtWorkRepository crudArtWorkRepository) {
        this.crudArtWorkRepository = crudArtWorkRepository;
    }

    public ArtWorkEntity addArtWork(ArtWorkEntity artWork) {
        return this.crudArtWorkRepository.save(artWork);
    }

    public List<ArtWorkEntity> findAllArtWorks() {
        return (List<ArtWorkEntity>) this.crudArtWorkRepository.findAll();
    }

    public Optional<ArtWorkEntity> getArtWorkById(Long id) {
        return this.crudArtWorkRepository.findById(id);
    }

    public void eraseArtWorkById(Long id) {
        this.crudArtWorkRepository.deleteByIdArtWork(id);
    }
}

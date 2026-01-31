package com.uneg.pictorialArcane.persistence.impl_repository;

import com.uneg.pictorialArcane.persistence.crud_repository.CrudArtWorkRepository;
import com.uneg.pictorialArcane.persistence.entity.ArtWorkEntity;
import org.springframework.stereotype.Repository;
import org.springframework.transaction.annotation.Transactional;

@Repository
public class ArtWorkRespository {

    private final CrudArtWorkRepository crudArtWorkRepository;

    public ArtWorkRespository(CrudArtWorkRepository crudArtWorkRepository) {
        this.crudArtWorkRepository = crudArtWorkRepository;
    }

    public ArtWorkEntity addArtWork(ArtWorkEntity artWork) {
        return this.crudArtWorkRepository.save(artWork);
    }
}

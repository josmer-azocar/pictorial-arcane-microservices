package com.uneg.pictorialArcane.persistence.crud_repository;

import com.uneg.pictorialArcane.persistence.entity.ArtWorkEntity;
import org.springframework.data.repository.CrudRepository;

public interface CrudArtWorkRepository extends CrudRepository<ArtWorkEntity, Long> {

    ArtWorkEntity findByName(String name);
    ArtWorkEntity deleteByIdArtWork(Long id);
}

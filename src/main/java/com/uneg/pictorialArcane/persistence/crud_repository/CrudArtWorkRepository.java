package com.uneg.pictorialArcane.persistence.crud_repository;

import com.uneg.pictorialArcane.persistence.entity.ArtWorkEntity;
import org.springframework.data.repository.CrudRepository;
import org.springframework.stereotype.Repository;


public interface CrudArtWorkRepository extends CrudRepository<ArtWorkEntity, Long> {

    ArtWorkEntity findByName(String name);
    ArtWorkEntity findFirstByIdArtWork(Long id);
    ArtWorkEntity deleteByIdArtWork(Long id);
}

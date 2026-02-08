package com.uneg.pictorialArcane.persistence.crud_repository;

import com.uneg.pictorialArcane.persistence.entity.ArtWorkEntity;
import com.uneg.pictorialArcane.persistence.entity.ArtistEntity;
import org.springframework.data.repository.CrudRepository;
import org.springframework.stereotype.Repository;


public interface CrudArtistRepository extends CrudRepository<ArtistEntity, Long> {
    ArtistEntity findFirstByIdArtist(Long idArtist);
}

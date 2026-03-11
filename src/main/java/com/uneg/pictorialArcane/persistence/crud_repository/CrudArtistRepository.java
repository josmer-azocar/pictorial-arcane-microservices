package com.uneg.pictorialArcane.persistence.crud_repository;

import com.uneg.pictorialArcane.persistence.entity.ArtistEntity;
import org.springframework.data.repository.CrudRepository;

public interface CrudArtistRepository extends CrudRepository<ArtistEntity, Long> {
    ArtistEntity findFirstByIdArtist(Long idArtist);
}

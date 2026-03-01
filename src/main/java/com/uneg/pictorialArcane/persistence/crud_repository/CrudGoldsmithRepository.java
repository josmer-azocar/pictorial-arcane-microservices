package com.uneg.pictorialArcane.persistence.crud_repository;

import com.uneg.pictorialArcane.persistence.entity.GoldsmithEntity;
import org.springframework.data.repository.CrudRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface CrudGoldsmithRepository extends CrudRepository<GoldsmithEntity, Long> {

    Optional<GoldsmithEntity> findFirstByIdArtWork(Long idArtWork);
}

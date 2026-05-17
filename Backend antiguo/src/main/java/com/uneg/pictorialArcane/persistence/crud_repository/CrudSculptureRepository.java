package com.uneg.pictorialArcane.persistence.crud_repository;

import com.uneg.pictorialArcane.persistence.entity.SculptureEntity;
import org.springframework.data.repository.CrudRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface CrudSculptureRepository extends CrudRepository<SculptureEntity, Long> {

    Optional<SculptureEntity> findFirstByIdArtWork(Long idArtWork);
}

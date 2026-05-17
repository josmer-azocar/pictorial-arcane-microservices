package com.uneg.pictorialArcane.persistence.crud_repository;

import com.uneg.pictorialArcane.persistence.entity.PaintingEntity;
import org.springframework.data.repository.CrudRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface CrudPaintingRepository extends CrudRepository<PaintingEntity, Long> {

    Optional<PaintingEntity> findFirstByIdArtWork(Long idArtWork);
}

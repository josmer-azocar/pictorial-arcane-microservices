package com.uneg.pictorialArcane.persistence.crud_repository;

import com.uneg.pictorialArcane.persistence.entity.PhotographyEntity;
import org.springframework.data.repository.CrudRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface CrudPhotographyRepository extends CrudRepository<PhotographyEntity, Long> {
}

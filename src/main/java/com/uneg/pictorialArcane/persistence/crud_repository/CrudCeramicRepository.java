package com.uneg.pictorialArcane.persistence.crud_repository;

import com.uneg.pictorialArcane.persistence.entity.CeramicEntity;
import org.springframework.data.repository.CrudRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface CrudCeramicRepository extends CrudRepository<CeramicEntity, Long> {
}

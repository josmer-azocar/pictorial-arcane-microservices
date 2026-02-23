package com.uneg.pictorialArcane.persistence.crud_repository;

import com.uneg.pictorialArcane.persistence.entity.GoldsmithEntity;
import org.springframework.data.repository.CrudRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface CrudGoldsmithRepository extends CrudRepository<GoldsmithEntity, Long> {
}

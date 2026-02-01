package com.uneg.pictorialArcane.persistence.crud_repository;


import com.uneg.pictorialArcane.persistence.entity.GenderEntity;
import org.springframework.data.repository.CrudRepository;

public interface CrudGenderRepository extends CrudRepository<GenderEntity, Long> {

}
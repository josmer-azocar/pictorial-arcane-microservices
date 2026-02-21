package com.uneg.pictorialArcane.persistence.crud_repository;

import com.uneg.pictorialArcane.persistence.entity.ClientEntity;
import org.springframework.data.repository.CrudRepository;

public interface CrudClientRepository extends CrudRepository<ClientEntity, Long> {

    ClientEntity findFirstByDniUser(Long dniUser);
}

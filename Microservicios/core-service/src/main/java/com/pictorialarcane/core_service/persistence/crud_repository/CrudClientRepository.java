package com.pictorialarcane.core_service.persistence.crud_repository;

import com.pictorialarcane.core_service.persistence.entity.ClientEntity;
import org.springframework.data.repository.CrudRepository;

public interface CrudClientRepository extends CrudRepository<ClientEntity, Long> {

    ClientEntity findFirstByDniUser(Long dniUser);
    ClientEntity findByUser_Email(String email);
}

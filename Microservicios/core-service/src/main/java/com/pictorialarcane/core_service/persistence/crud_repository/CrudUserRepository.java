package com.pictorialarcane.core_service.persistence.crud_repository;

import com.pictorialarcane.core_service.persistence.entity.UserEntity;
import org.springframework.data.repository.CrudRepository;
import java.util.Optional;

public interface CrudUserRepository extends CrudRepository<UserEntity, Long> {

    Optional<UserEntity> findByEmail(String email);
    UserEntity findFirstByEmail(String email);
    void deleteByDniUser(Long dniUser);
    UserEntity findByDniUser(Long dniUser);
}


package com.uneg.pictorialArcane.persistence.crud_repository;

import com.uneg.pictorialArcane.persistence.entity.UserEntity;
import org.springframework.data.repository.CrudRepository;
import java.util.Optional;

public interface CrudUserRepository extends CrudRepository<UserEntity, Long> {

    Optional<UserEntity> findByEmail(String email);
    UserEntity findFirstByEmail(String email);
    Void deleteByDniUser(Long dniUser);
    UserEntity findByDniUser(Long dniUser);
}


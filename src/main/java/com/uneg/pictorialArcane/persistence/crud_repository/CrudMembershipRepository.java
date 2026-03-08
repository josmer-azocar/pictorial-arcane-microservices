package com.uneg.pictorialArcane.persistence.crud_repository;

import com.uneg.pictorialArcane.persistence.entity.MembershipEntity;
import org.springframework.data.repository.CrudRepository;

import java.util.Optional;

public interface CrudMembershipRepository extends CrudRepository<MembershipEntity, Long> {
    Optional<MembershipEntity> findFirstByClient_DniUserAndStatus(Long dniUser, String status);
}

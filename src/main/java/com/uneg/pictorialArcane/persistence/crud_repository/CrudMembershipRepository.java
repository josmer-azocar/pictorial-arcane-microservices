package com.uneg.pictorialArcane.persistence.crud_repository;

import com.uneg.pictorialArcane.persistence.entity.MembershipEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.time.LocalDate;
import java.util.Optional;

public interface CrudMembershipRepository extends JpaRepository<MembershipEntity, Long>, JpaSpecificationExecutor<MembershipEntity> {
    Optional<MembershipEntity> findFirstByClient_DniUserAndStatus(Long dniUser, String status);

    @Modifying
    @Query("UPDATE MembershipEntity m SET m.status = :expiredStatus " +
            "WHERE m.status = :activeStatus AND m.expiryDate <= :today")
    int expireMemberships(@Param("today") LocalDate today,
                          @Param("activeStatus") String activeStatus,
                          @Param("expiredStatus") String expiredStatus);
}

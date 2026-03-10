package com.uneg.pictorialArcane.persistence.crud_repository;

import com.uneg.pictorialArcane.persistence.entity.MembershipEntity;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.CrudRepository;
import org.springframework.data.repository.query.Param;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.Optional;

public interface CrudMembershipRepository extends CrudRepository<MembershipEntity, Long> {
    Optional<MembershipEntity> findFirstByClient_DniUserAndStatus(Long dniUser, String status);

    @Query("SELECT m FROM MembershipEntity m WHERE " +
            "(:status IS NULL OR m.status = :status) AND " +
            "(:startDate IS NULL OR m.paymentDate >= :startDate) AND " +
            "(:endDate IS NULL OR m.paymentDate <= :endDate)")
    Page<MembershipEntity> searchMembershipsByFilters(
            @Param("status") String status,
            @Param("startDate") LocalDate startDate,
            @Param("endDate") LocalDate endDate,
            Pageable pageable);

    @Modifying
    @Query("UPDATE MembershipEntity m SET m.status = :expiredStatus " +
            "WHERE m.status = :activeStatus AND m.expiryDate <= :today")
    int expireMemberships(@Param("today") LocalDate today,
                          @Param("activeStatus") String activeStatus,
                          @Param("expiredStatus") String expiredStatus);
}

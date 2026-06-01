package com.pictorialarcane.core_service.persistence.crud_repository;

import com.pictorialarcane.core_service.persistence.entity.SaleEntity;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.CrudRepository;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;

@Repository
public interface CrudSaleRepositoy extends CrudRepository<SaleEntity, Long> {

    List<SaleEntity> findAllBySaleStatusAndCreatedAtBefore(String saleStatus, LocalDateTime createdAtBefore);

    SaleEntity findByIdSale(Long idSale);

    @Query("SELECT p FROM SaleEntity p WHERE p.client.dniUser = :dniUser")
    Page<SaleEntity> getClientPurchases(
            @Param("dniUser") Long dniUser,
            Pageable pageable
    );

    @Query("SELECT s FROM SaleEntity s WHERE s.saleStatus = 'APPROVED' AND s.date >= :startDate AND s.date <= :endDate")
    List<SaleEntity> findApprovedSalesByDateRange(
            @Param("startDate") LocalDate startDate,
            @Param("endDate") LocalDate endDate
    );
}

package com.uneg.pictorialArcane.persistence.crud_repository;

import com.uneg.pictorialArcane.persistence.entity.SaleEntity;
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

    List<SaleEntity> findAllBySaleStatusContainsAndCreatedAtBeforeAndArtWork_Status(String saleStatus, LocalDateTime createdAtBefore, String artWorkStatus);

    SaleEntity findByIdSale(Long idSale);

    @Query("SELECT p FROM SaleEntity p WHERE p.client.dniUser = :dniUser")
    Page<SaleEntity> getClientPurchases(
            @Param("dniUser") Long dniUser,
            Pageable pageable
    );
}

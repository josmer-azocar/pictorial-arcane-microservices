package com.uneg.pictorialArcane.persistence.crud_repository;

import com.uneg.pictorialArcane.persistence.entity.SaleEntity;
import org.springframework.data.repository.CrudRepository;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;

@Repository
public interface CrudSaleRepositoy extends CrudRepository<SaleEntity, Long> {

    List<SaleEntity> findAllBySaleStatusContainsAndCreatedAtBeforeAndArtWork_Status(String saleStatus, LocalDateTime createdAtBefore, String artWorkStatus);

    SaleEntity findByIdSale(Long idSale);
}

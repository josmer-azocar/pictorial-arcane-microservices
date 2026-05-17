package com.uneg.pictorialArcane.persistence.crud_repository;

import com.uneg.pictorialArcane.persistence.entity.PaymentEntity;
import org.springframework.data.repository.CrudRepository;

public interface CrudPaymentRepository extends CrudRepository<PaymentEntity, Long> {
}

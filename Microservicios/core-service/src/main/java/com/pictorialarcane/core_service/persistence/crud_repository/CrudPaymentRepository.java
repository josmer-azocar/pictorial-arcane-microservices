package com.pictorialarcane.core_service.persistence.crud_repository;

import com.pictorialarcane.core_service.persistence.entity.PaymentEntity;
import org.springframework.data.repository.CrudRepository;

public interface CrudPaymentRepository extends CrudRepository<PaymentEntity, Long> {
}

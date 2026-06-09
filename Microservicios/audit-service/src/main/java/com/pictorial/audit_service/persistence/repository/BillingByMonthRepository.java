package com.pictorial.audit_service.persistence.repository;

import com.pictorial.audit_service.persistence.tables.BillingByMonthKey;
import com.pictorial.audit_service.persistence.tables.BillingByMonthTable;
import org.springframework.data.cassandra.repository.CassandraRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface BillingByMonthRepository extends CassandraRepository<BillingByMonthTable, BillingByMonthKey> {

    /**
     * Obtiene toda la facturación asociada a un mes específico (ej: "2026-06").
     * Esto traerá los registros ordenados de forma descendente por fecha de venta de forma nativa.
     */
    List<BillingByMonthTable> findByKeyYearMonth(String yearMonth);
}

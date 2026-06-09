package com.pictorial.audit_service.persistence.repository;

import com.pictorial.audit_service.persistence.tables.SecurityLogByEventKey;
import com.pictorial.audit_service.persistence.tables.SecurityLogByEventTable;
import org.springframework.data.cassandra.repository.CassandraRepository;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.util.List;

@Repository
public interface SecurityLogByEventRepository extends CassandraRepository<SecurityLogByEventTable, SecurityLogByEventKey> {

    /**
     * Busca bitácoras proporcionando la llave de partición compuesta completa.
     * Cumple de forma estricta con el modelo de datos distribuido de Cassandra.
     */
    List<SecurityLogByEventTable> findByKeyEventTypeAndKeyEventDate(String eventType, LocalDate eventDate);
}

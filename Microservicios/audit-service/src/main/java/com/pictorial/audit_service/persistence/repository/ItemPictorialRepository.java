package com.pictorial.audit_service.persistence.repository;

import org.springframework.data.cassandra.repository.CassandraRepository;
import org.springframework.stereotype.Repository;
import java.util.UUID;

@Repository
public interface ItemPictorialRepository extends CassandraRepository<ItemPictorial, UUID> {
    // Al igual que en JPA/Mongo, cuentas con findById, save, delete, etc.
}
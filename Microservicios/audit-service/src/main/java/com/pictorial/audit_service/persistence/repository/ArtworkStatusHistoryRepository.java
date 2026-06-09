package com.pictorial.audit_service.persistence.repository;

import com.pictorial.audit_service.persistence.tables.ArtworkStatusHistoryKey;
import com.pictorial.audit_service.persistence.tables.ArtworkStatusHistoryTable;
import org.springframework.data.cassandra.repository.CassandraRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ArtworkStatusHistoryRepository extends CassandraRepository<ArtworkStatusHistoryTable, ArtworkStatusHistoryKey> {

    /**
     * Recupera el historial filtrando por su llave de partición obligatoria.
     * Cassandra exige que la llave de partición esté presente en este tipo de búsquedas.
     */
    List<ArtworkStatusHistoryTable> findByKeyArtworkId(Long artworkId);
}

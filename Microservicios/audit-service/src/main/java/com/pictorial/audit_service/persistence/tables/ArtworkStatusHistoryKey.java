package com.pictorial.audit_service.persistence.tables;

import lombok.*;
import org.springframework.data.cassandra.core.cql.Ordering;
import org.springframework.data.cassandra.core.cql.PrimaryKeyType;
import org.springframework.data.cassandra.core.mapping.PrimaryKeyClass;
import org.springframework.data.cassandra.core.mapping.PrimaryKeyColumn;

import java.io.Serializable;
import java.time.Instant;
import java.util.Objects;
import java.util.UUID;

@Builder
@Data
@Getter
@Setter
@PrimaryKeyClass
public class ArtworkStatusHistoryKey implements Serializable {

    @PrimaryKeyColumn(name = "artwork_id", type = PrimaryKeyType.PARTITIONED, ordinal = 0)
    private Long artworkId;

    @PrimaryKeyColumn(name = "changed_at", type = PrimaryKeyType.CLUSTERED, ordinal = 1, ordering = Ordering.DESCENDING)
    private Instant changedAt;

    @PrimaryKeyColumn(name = "change_id", type = PrimaryKeyType.CLUSTERED, ordinal = 2, ordering = Ordering.DESCENDING)
    private UUID changeId; // Mapea el timeuuid de Cassandra

    // Constructor vacío obligatorio
    public ArtworkStatusHistoryKey() {}

    public ArtworkStatusHistoryKey(Long artworkId, Instant changedAt, UUID changeId) {
        this.artworkId = artworkId;
        this.changedAt = changedAt;
        this.changeId = changeId;
    }

    // Getters y Setters

    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (o == null || getClass() != o.getClass()) return false;
        ArtworkStatusHistoryKey honesty = (ArtworkStatusHistoryKey) o;
        return Objects.equals(artworkId, honesty.artworkId) &&
                Objects.equals(changedAt, honesty.changedAt) &&
                Objects.equals(changeId, honesty.changeId);
    }

    @Override
    public int hashCode() {
        return Objects.hash(artworkId, changedAt, changeId);
    }
}
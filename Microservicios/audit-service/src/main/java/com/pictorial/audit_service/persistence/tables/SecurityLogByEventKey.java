package com.pictorial.audit_service.persistence.tables;

import lombok.*;
import org.springframework.data.cassandra.core.cql.Ordering;
import org.springframework.data.cassandra.core.cql.PrimaryKeyType;
import org.springframework.data.cassandra.core.mapping.PrimaryKeyClass;
import org.springframework.data.cassandra.core.mapping.PrimaryKeyColumn;

import java.io.Serializable;
import java.time.Instant;
import java.time.LocalDate;
import java.util.Objects;
import java.util.UUID;

@Builder
@Data
@Getter
@Setter
@PrimaryKeyClass
public class SecurityLogByEventKey implements Serializable {

    // Ambos campos forman la llave de partición compuesta
    @PrimaryKeyColumn(name = "event_type", type = PrimaryKeyType.PARTITIONED, ordinal = 0)
    private String eventType;

    @PrimaryKeyColumn(name = "event_date", type = PrimaryKeyType.PARTITIONED, ordinal = 1)
    private LocalDate eventDate;

    // Clustering keys distribuidas de manera descendente
    @PrimaryKeyColumn(name = "event_time", type = PrimaryKeyType.CLUSTERED, ordinal = 2, ordering = Ordering.DESCENDING)
    private Instant eventTime;

    @org.springframework.data.cassandra.core.mapping.CassandraType(type = org.springframework.data.cassandra.core.mapping.CassandraType.Name.TIMEUUID)
    @PrimaryKeyColumn(name = "event_id", type = PrimaryKeyType.CLUSTERED, ordinal = 3, ordering = Ordering.DESCENDING)
    private UUID eventId;

    public SecurityLogByEventKey() {}

    public SecurityLogByEventKey(String eventType, LocalDate eventDate, Instant eventTime, UUID eventId) {
        this.eventType = eventType;
        this.eventDate = eventDate;
        this.eventTime = eventTime;
        this.eventId = eventId;
    }

    // Getters y Setters

    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (o == null || getClass() != o.getClass()) return false;
        SecurityLogByEventKey that = (SecurityLogByEventKey) o;
        return Objects.equals(eventType, that.eventType) &&
                Objects.equals(eventDate, that.eventDate) &&
                Objects.equals(eventTime, that.eventTime) &&
                Objects.equals(eventId, that.eventId);
    }

    @Override
    public int hashCode() {
        return Objects.hash(eventType, eventDate, eventTime, eventId);
    }
}

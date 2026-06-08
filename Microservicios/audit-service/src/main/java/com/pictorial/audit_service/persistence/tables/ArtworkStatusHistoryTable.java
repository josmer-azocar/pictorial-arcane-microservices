package com.pictorial.audit_service.persistence.tables;

import lombok.*;
import org.springframework.data.cassandra.core.mapping.Column;
import org.springframework.data.cassandra.core.mapping.PrimaryKey;
import org.springframework.data.cassandra.core.mapping.Table;

import java.time.Instant;

@Builder
@Data
@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@Table("artwork_status_history")
public class ArtworkStatusHistoryTable {

    @PrimaryKey
    private ArtworkStatusHistoryKey key;

    @Column("artwork_name")
    private String artworkName;

    @Column("changed_by")
    private Long changedBy;

    @Column("created_at")
    private Instant createdAt;

    @Column("new_status")
    private String newStatus;

    @Column("old_status")
    private String oldStatus;

    private String reason;

}

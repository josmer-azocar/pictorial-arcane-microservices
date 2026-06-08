package com.pictorial.audit_service.persistence.tables;

import lombok.*;
import org.springframework.data.cassandra.core.mapping.Column;
import org.springframework.data.cassandra.core.mapping.PrimaryKey;
import org.springframework.data.cassandra.core.mapping.Table;

import java.net.InetAddress;

@Builder
@Data
@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@Table("security_log_by_event")
public class SecurityLogByEventTable {

    @PrimaryKey
    private SecurityLogByEventKey key;

    @Column("admin_dni")
    private Long adminDni;

    @Column("client_dni")
    private Long clientDni;

    private String details;

    @Column("ip_address")
    private InetAddress ipAddress; // Mapea el tipo 'inet' nativo de Cassandra

    @Column("session_id")
    private String sessionId;

}
package com.pictorial.artwork_service.document;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

/**
 * Contador para generar identificadores numéricos de negocio (clave compartida con
 * core-service y audit-service, que modelan el id de obra como Long).
 */
@Document(collection = "db_sequences")
public class DbSequence {

    @Id
    private String id;
    private long seq;

    public DbSequence() {}

    public String getId() { return id; }
    public void setId(String id) { this.id = id; }
    public long getSeq() { return seq; }
    public void setSeq(long seq) { this.seq = seq; }
}
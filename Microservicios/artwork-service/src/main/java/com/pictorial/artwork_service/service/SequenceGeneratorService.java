package com.pictorial.artwork_service.service;

import com.pictorial.artwork_service.document.DbSequence;
import org.springframework.data.mongodb.core.FindAndModifyOptions;
import org.springframework.data.mongodb.core.MongoTemplate;
import org.springframework.data.mongodb.core.query.Criteria;
import org.springframework.data.mongodb.core.query.Query;
import org.springframework.data.mongodb.core.query.Update;
import org.springframework.stereotype.Service;

/**
 * Genera identificadores numéricos incrementales usando una colección de contadores en MongoDB.
 * Permite que artwork-service exponga una clave de negocio Long compatible con core/audit,
 * además del ObjectId nativo (_id) de cada documento.
 */
@Service
public class SequenceGeneratorService {

    public static final String ARTWORK_SEQUENCE = "artwork_sequence";

    private final MongoTemplate mongoTemplate;

    public SequenceGeneratorService(MongoTemplate mongoTemplate) {
        this.mongoTemplate = mongoTemplate;
    }

    public long nextValue(String sequenceName) {
        DbSequence counter = mongoTemplate.findAndModify(
                new Query(Criteria.where("_id").is(sequenceName)),
                new Update().inc("seq", 1),
                FindAndModifyOptions.options().returnNew(true).upsert(true),
                DbSequence.class);
        return counter != null ? counter.getSeq() : 1L;
    }
}

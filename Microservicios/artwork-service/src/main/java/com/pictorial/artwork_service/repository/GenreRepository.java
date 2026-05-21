package com.pictorial.artwork_service.repository;

import com.pictorial.artwork_service.document.GenreDocument;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface GenreRepository extends MongoRepository<GenreDocument, String> {
    Optional<GenreDocument> findByName(String name);
}

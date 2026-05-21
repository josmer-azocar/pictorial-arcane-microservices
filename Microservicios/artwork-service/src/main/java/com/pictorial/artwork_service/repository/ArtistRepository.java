package com.pictorial.artwork_service.repository;

import com.pictorial.artwork_service.document.ArtistDocument;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ArtistRepository extends MongoRepository<ArtistDocument, String> {
    List<ArtistDocument> findByNameContainingIgnoreCase(String name);
    List<ArtistDocument> findByLastNameContainingIgnoreCase(String lastName);
    List<ArtistDocument> findByNationalityContainingIgnoreCase(String nationality);
    List<ArtistDocument> findByGenreIdsContains(String genreId);
}

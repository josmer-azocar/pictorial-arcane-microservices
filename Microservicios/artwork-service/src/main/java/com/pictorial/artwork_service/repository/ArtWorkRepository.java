package com.pictorial.artwork_service.repository;

import com.pictorial.artwork_service.document.ArtWorkDocument;
import com.pictorial.artwork_service.document.ArtWorkStatus;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ArtWorkRepository extends MongoRepository<ArtWorkDocument, String> {
    List<ArtWorkDocument> findByArtistId(String artistId);
    List<ArtWorkDocument> findByGenreId(String genreId);
    List<ArtWorkDocument> findByNameContainingIgnoreCase(String name);
    List<ArtWorkDocument> findByStatus(ArtWorkStatus status);
    List<ArtWorkDocument> findByPriceBetween(double min, double max);
}

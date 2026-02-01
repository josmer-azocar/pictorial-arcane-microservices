package com.uneg.pictorialArcane.persistence.impl_repository;

import com.uneg.pictorialArcane.persistence.crud_repository.CrudArtistRepository;
import com.uneg.pictorialArcane.persistence.entity.ArtWorkEntity;
import com.uneg.pictorialArcane.persistence.entity.ArtistEntity;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public class ArtistRepository {

    private final CrudArtistRepository crudArtistRepository;

    public ArtistRepository(CrudArtistRepository crudArtistRepository) {
        this.crudArtistRepository = crudArtistRepository;
    }

    public ArtistEntity saveArtist(ArtistEntity artist) {
        return crudArtistRepository.save(artist);
    }

    public ArtistEntity addArtist(ArtistEntity artist) {
        return this.crudArtistRepository.save(artist);
    }

    public List<ArtistEntity> findAllArtist() {
        return (List<ArtistEntity>) this.crudArtistRepository.findAll();
    }

    public Optional<ArtistEntity> getArtistById(Long id) {
        return this.crudArtistRepository.findById(id);
    }

    public void eraseArtistById(Long id) {
        this.crudArtistRepository.deleteById(id);
    }
}

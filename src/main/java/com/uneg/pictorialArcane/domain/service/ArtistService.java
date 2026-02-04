package com.uneg.pictorialArcane.domain.service;

import com.uneg.pictorialArcane.persistence.entity.ArtWorkEntity;
import com.uneg.pictorialArcane.persistence.entity.ArtistEntity;
import com.uneg.pictorialArcane.persistence.impl_repository.ArtistRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class ArtistService {

    private final ArtistRepository artistRepository;

    public ArtistService(ArtistRepository artistRepository) {
        this.artistRepository = artistRepository;
    }

    public ArtistEntity saveArtist(ArtistEntity artist) {
        return artistRepository.saveArtist(artist);
    }

    public ArtistEntity addArtist(ArtistEntity artist) {
        return this.artistRepository.addArtist(artist);
    }

    public List<ArtistEntity> getAllArtist() {
        return artistRepository.findAllArtist();
    }

    public ArtistEntity getArtistById(Long id){
        return artistRepository.getArtistById(id).orElseThrow(() -> new RuntimeException("Artista " +
                "no encontrado ID: " + id));
    }

    public void deleteArtistById(Long id) {
        if (artistRepository.getArtistById(id).isPresent()){
            artistRepository.eraseArtistById(id);
        }else {
            throw new RuntimeException("No se puede eliminar el ID: " + id);
        }
    }
}

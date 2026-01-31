package com.uneg.pictorialArcane.domain.service;

import com.uneg.pictorialArcane.persistence.entity.ArtWorkEntity;
import com.uneg.pictorialArcane.persistence.impl_repository.ArtWorkRespository;
import org.springframework.stereotype.Service;

@Service
public class ArtWorkService {

    private final ArtWorkRespository artWorkRespository;

    public ArtWorkService(ArtWorkRespository artWorkRespository) {
        this.artWorkRespository = artWorkRespository;
    }

    public ArtWorkEntity addArtWork(ArtWorkEntity artWork) {
        return this.artWorkRespository.addArtWork(artWork);
    }
}

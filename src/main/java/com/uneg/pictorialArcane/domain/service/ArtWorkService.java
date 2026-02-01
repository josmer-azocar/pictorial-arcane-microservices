package com.uneg.pictorialArcane.domain.service;

import com.uneg.pictorialArcane.persistence.entity.ArtWorkEntity;
import com.uneg.pictorialArcane.persistence.impl_repository.ArtWorkRespository;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class ArtWorkService {

    private final ArtWorkRespository artWorkRespository;

    public ArtWorkService(ArtWorkRespository artWorkRespository) {
        this.artWorkRespository = artWorkRespository;
    }

    public ArtWorkEntity addArtWork(ArtWorkEntity artWork) {
        return this.artWorkRespository.addArtWork(artWork);
    }

    public List<ArtWorkEntity> getAllArtWorks() {
        return artWorkRespository.findAllArtWorks();
    }

   public ArtWorkEntity getArtWorkById(Long id){
        return artWorkRespository.getArtWorkById(id).orElseThrow(() -> new RuntimeException("Obra " +
                "no encontrada ID: " + id));
   }

    public void deleteArtWorkById(Long id) {
        if (artWorkRespository.getArtWorkById(id).isPresent()){
            artWorkRespository.eraseArtWorkById(id);
        }else {
            throw new RuntimeException("No se puede eliminar el ID: " + id);
        }
    }

}

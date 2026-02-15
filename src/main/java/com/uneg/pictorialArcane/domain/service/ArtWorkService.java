package com.uneg.pictorialArcane.domain.service;

import com.uneg.pictorialArcane.domain.dto.request.ArtWorkRequestDto;
import com.uneg.pictorialArcane.domain.dto.response.ArtWorkResponseDto;
import com.uneg.pictorialArcane.domain.dto.update.UpdateArtWorkDto;
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

    public ArtWorkResponseDto addArtWork(ArtWorkRequestDto artWork) {
        return this.artWorkRespository.addArtWork(artWork);
    }

    public List<ArtWorkEntity> getAllArtWorks() {

        return artWorkRespository.findAllArtWorks();
    }

   public ArtWorkResponseDto getArtWorkById(Long id){
        return artWorkRespository.getArtWorkById(id);
   }


    public void deleteArtWorkById(Long id) {
        this.artWorkRespository.getArtWorkById(id);
        this.artWorkRespository.eraseArtWorkById(id);

    }

    public ArtWorkResponseDto updateArtWork(Long id, UpdateArtWorkDto artWork){

        return this.artWorkRespository.updateArtWork(id, artWork);
    }


}

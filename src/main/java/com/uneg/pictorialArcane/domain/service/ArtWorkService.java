package com.uneg.pictorialArcane.domain.service;

import com.uneg.pictorialArcane.domain.dto.request.ArtWorkRequestDto;
import com.uneg.pictorialArcane.domain.dto.response.ArtWork2ResponseDto;
import com.uneg.pictorialArcane.domain.dto.response.ArtWorkResponseDto;
import com.uneg.pictorialArcane.domain.dto.update.UpdateArtWorkDto;
import com.uneg.pictorialArcane.persistence.entity.ArtWorkEntity;
import com.uneg.pictorialArcane.persistence.impl_repository.ArtWorkRespository;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
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

    public List<ArtWorkResponseDto> getAllArtWorks() {

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


    public Page<ArtWork2ResponseDto> filterArtWorks(Long idGender, Long idArtist, String title, Double min, Double max, Pageable pageable) {
        return this.artWorkRespository.filterArtWorks(idGender,idArtist,title, min, max, pageable);
    }
}

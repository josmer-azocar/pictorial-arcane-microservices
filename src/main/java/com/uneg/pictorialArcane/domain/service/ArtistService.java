package com.uneg.pictorialArcane.domain.service;

import com.uneg.pictorialArcane.domain.dto.request.ArtWorkRequestDto;
import com.uneg.pictorialArcane.domain.dto.request.ArtistRequestDto;
import com.uneg.pictorialArcane.domain.dto.response.ArtWorkResponseDto;
import com.uneg.pictorialArcane.domain.dto.response.ArtistResponseDto;
import com.uneg.pictorialArcane.domain.dto.update.UpdateArtWorkDto;
import com.uneg.pictorialArcane.domain.dto.update.UpdateArtistDto;
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

    /*public ArtistEntity saveArtist(ArtistEntity artist) {
        return artistRepository.saveArtist(artist);
    }*/

    public ArtistResponseDto addArtist(ArtistRequestDto artist) {
        return this.artistRepository.addArtist(artist);
    }

    public List<ArtistResponseDto> getAllArtist() {
        return this.artistRepository.findAllArtist();
    }

    public ArtistResponseDto getArtistById(Long id){
        return this.artistRepository.getArtistById(id);
    }

    public void deleteArtistById(Long id) {
        this.artistRepository.getArtistById(id);
        this.artistRepository.eraseArtistById(id);
    }

    public ArtistResponseDto updateArtist(Long id, UpdateArtistDto artist){

        return this.artistRepository.updateArtist(id, artist);
    }
}

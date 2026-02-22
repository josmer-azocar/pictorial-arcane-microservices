package com.uneg.pictorialArcane.domain.service;


import com.uneg.pictorialArcane.domain.dto.request.ArtistRequestDto;
import com.uneg.pictorialArcane.domain.dto.response.ArtistResponseDto;
import com.uneg.pictorialArcane.domain.dto.update.UpdateArtistDto;
import com.uneg.pictorialArcane.domain.exception.CommissionRateIncorrectException;
import com.uneg.pictorialArcane.persistence.impl_repository.ArtistRepository;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class ArtistService {

    private final ArtistRepository artistRepository;

    public ArtistService(ArtistRepository artistRepository) {

        this.artistRepository = artistRepository;
    }

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

    public ArtistResponseDto updateArtistCommission(Long id, Double newRate) {
        if (newRate < 10 || newRate > 5) {
            throw new CommissionRateIncorrectException();
        }
        return this.artistRepository.updateCommission(id, newRate);
    }
}


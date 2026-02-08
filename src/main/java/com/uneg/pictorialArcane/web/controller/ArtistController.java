package com.uneg.pictorialArcane.web.controller;

import com.uneg.pictorialArcane.domain.dto.request.ArtistRequestDto;
import com.uneg.pictorialArcane.domain.dto.response.ArtistResponseDto;
import com.uneg.pictorialArcane.domain.dto.update.UpdateArtistDto;
import com.uneg.pictorialArcane.domain.service.ArtistService;
import com.uneg.pictorialArcane.persistence.entity.ArtistEntity;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/artist")
public class ArtistController {

    private final ArtistService artistService;

    public ArtistController(ArtistService artistService) {
        this.artistService = artistService;
    }

    @PostMapping("/add")
    @PreAuthorize("hasRole('ADMIN')")
    ResponseEntity<ArtistResponseDto> addArtist(@RequestBody @Valid ArtistRequestDto artist){
        return ResponseEntity.status(HttpStatus.CREATED).body(this.artistService.addArtist(artist));
    }

    @GetMapping("/all")
    ResponseEntity<List<ArtistResponseDto>> getAllArtist(){
        return ResponseEntity.ok(this.artistService.getAllArtist());
    }

    @GetMapping("/{id}")
    ResponseEntity<ArtistResponseDto> getArtistById(@PathVariable Long id){
        return ResponseEntity.ok(this.artistService.getArtistById(id));
    }

    @PutMapping("/delete/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    ResponseEntity<ArtistResponseDto> updateArtist(@PathVariable Long id, @RequestBody @Valid UpdateArtistDto artist){
        return ResponseEntity.ok(this.artistService.updateArtist(id, artist));
    }

    @DeleteMapping("/delete/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    ResponseEntity<Void> deleteArtistById(@PathVariable Long id){
        this.artistService.deleteArtistById(id);
        return ResponseEntity.noContent().build();
    }

}
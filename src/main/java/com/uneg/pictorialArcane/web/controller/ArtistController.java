package com.uneg.pictorialArcane.web.controller;

import com.uneg.pictorialArcane.domain.service.ArtistService;
import com.uneg.pictorialArcane.persistence.entity.ArtistEntity;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
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
    ResponseEntity<ArtistEntity> addArtist(@RequestBody ArtistEntity artist){
        return ResponseEntity.ok(this.artistService.addArtist(artist));
    }

    @GetMapping("/all")
    ResponseEntity<List<ArtistEntity>> getAllArtist(){
        return ResponseEntity.ok(this.artistService.getAllArtist());
    }

    @GetMapping("/{id}")
    ResponseEntity<?> getArtistById(@PathVariable Long id){
        try{
            ArtistEntity artist = this.artistService.getArtistById(id);
            return ResponseEntity.ok(artist); //devuelve un codigo 200 con el objeto
        } catch (RuntimeException e) {
            //error 404 no encontrado
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Artist not found");
        }
    }

    @DeleteMapping("/delete/{id}")
    ResponseEntity<?> deleteArtistById(@PathVariable Long id){
        try{
            this.artistService.deleteArtistById(id);
            return ResponseEntity.noContent().build(); //devuelve un codigo 204
        } catch (RuntimeException e) {
            return  ResponseEntity.status(HttpStatus.NOT_FOUND).body("could not be deleted");
        }


    }
}
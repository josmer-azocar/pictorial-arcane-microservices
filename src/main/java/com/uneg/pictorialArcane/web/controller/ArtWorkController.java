package com.uneg.pictorialArcane.web.controller;

import com.uneg.pictorialArcane.domain.service.ArtWorkService;
import com.uneg.pictorialArcane.persistence.entity.ArtWorkEntity;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;


@RestController
@RequestMapping("/artwork")
public class ArtWorkController {

    private final ArtWorkService artWorkService;

    public ArtWorkController(ArtWorkService artWorkService) {
        this.artWorkService = artWorkService;
    }

    @PostMapping("/addArtWork")
    ResponseEntity<ArtWorkEntity> addArtWork(@RequestBody ArtWorkEntity artWork){
        return ResponseEntity.ok(this.artWorkService.addArtWork(artWork));
    }

    @GetMapping("/all")
    ResponseEntity<List<ArtWorkEntity>> getAllArtWorks(){
        return ResponseEntity.ok(this.artWorkService.getAllArtWorks());
    }

    @GetMapping("/{id}")
    ResponseEntity<?> getArtWorkById(@PathVariable Long id){
        try{
            ArtWorkEntity artWork = this.artWorkService.getArtWorkById(id);
            return ResponseEntity.ok(artWork);
        } catch (RuntimeException e) {
            //error 404
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(e.getMessage());
        }
    }

    @DeleteMapping("/delete/{id}")
    ResponseEntity<Void> deleteArtWorkById(@PathVariable Long id){
        this.artWorkService.deleteArtWorkById(id);
        return ResponseEntity.noContent().build();
    }
}

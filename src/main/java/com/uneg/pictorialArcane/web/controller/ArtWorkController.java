package com.uneg.pictorialArcane.web.controller;

import com.uneg.pictorialArcane.domain.service.ArtWorkService;
import com.uneg.pictorialArcane.persistence.entity.ArtWorkEntity;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

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
}

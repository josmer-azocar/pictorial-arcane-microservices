package com.uneg.pictorialArcane.web.controller;

import com.uneg.pictorialArcane.domain.dto.request.ArtWorkRequestDto;
import com.uneg.pictorialArcane.domain.dto.response.ArtWork2ResponseDto;
import com.uneg.pictorialArcane.domain.dto.response.ArtWorkResponseDto;
import com.uneg.pictorialArcane.domain.dto.update.UpdateArtWorkDto;
import com.uneg.pictorialArcane.domain.service.ArtWorkService;
import com.uneg.pictorialArcane.persistence.entity.ArtWorkEntity;
import jakarta.validation.Valid;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.data.web.PageableDefault;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;


@RestController
@RequestMapping("/artwork")
public class ArtWorkController {

    //Inyeccion del Service
    private final ArtWorkService artWorkService;
    public ArtWorkController(ArtWorkService artWorkService) {
        this.artWorkService = artWorkService;
    }

    //Metodos HTTP
    @PostMapping("/addArtWork")
    @PreAuthorize("hasRole('ADMIN')")
    ResponseEntity<ArtWorkResponseDto> addArtWork(@RequestBody @Valid ArtWorkRequestDto artWork){
        return ResponseEntity.status(HttpStatus.CREATED).body(this.artWorkService.addArtWork(artWork));
    }

    @GetMapping("/all")
    ResponseEntity<List<ArtWorkEntity>> getAllArtWorks(){
        return ResponseEntity.ok(this.artWorkService.getAllArtWorks());
    }

    @GetMapping("/{id}")
    ResponseEntity<ArtWorkResponseDto> getArtWorkById(@PathVariable Long id){
        return ResponseEntity.ok(this.artWorkService.getArtWorkById(id));
    }

    @DeleteMapping("/delete/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    ResponseEntity<Void> deleteArtWorkById(@PathVariable Long id){
        this.artWorkService.deleteArtWorkById(id);
        return ResponseEntity.noContent().build();
    }

    @PutMapping("/update/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    ResponseEntity<ArtWorkResponseDto> update(@PathVariable Long id, @RequestBody @Valid UpdateArtWorkDto artWorkDto){
        return ResponseEntity.ok(this.artWorkService.updateArtWork(id, artWorkDto));
    }

    @GetMapping("/search")
    public ResponseEntity<Page<ArtWork2ResponseDto>> searchArtWorks(
            @RequestParam(required = false) Long idGender,
            @RequestParam(required = false) Long idArtist,
            @RequestParam(required = false) String title,
            @RequestParam(required = false) Double min,
            @RequestParam(required = false) Double max,
            @PageableDefault(size = 9, sort = "price", direction = Sort.Direction.ASC) Pageable pageable
    ) {
        // Pageable ya trae: página actual, cuántos elementos traer y el ordenamiento
        Page<ArtWork2ResponseDto> pageResults = artWorkService.filterArtWorks(idGender, idArtist, title, min, max, pageable);
        return ResponseEntity.ok(pageResults);
    }
}

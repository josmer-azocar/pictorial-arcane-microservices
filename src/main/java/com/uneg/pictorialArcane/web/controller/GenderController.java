package com.uneg.pictorialArcane.web.controller;

import com.uneg.pictorialArcane.domain.service.GenderService;
import com.uneg.pictorialArcane.persistence.entity.ArtistEntity;
import com.uneg.pictorialArcane.persistence.entity.GenderEntity;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/gender")
public class GenderController {

    private final GenderService genderService;

    public GenderController(GenderService genderService) { this.genderService = genderService; }

    @GetMapping("/all")
    public ResponseEntity<List<GenderEntity>> getAllGender() {
        return ResponseEntity.ok(this.genderService.getAllGender());
    }

    @PostMapping("/add")
    public ResponseEntity<GenderEntity> add(@RequestBody GenderEntity gender) {
        return ResponseEntity.ok(this.genderService.saveGender(gender));
    }
    @GetMapping("/{id}")
    ResponseEntity<?> getGenderById(@PathVariable Long id){
        try{
            GenderEntity gender = this.genderService.getGenderById(id);
            return ResponseEntity.ok(gender); //devuelve un codigo 200 con el objeto
        } catch (RuntimeException e) {
            //error 404 no encontrado
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body("gender not found");
        }
    }

    @DeleteMapping("/delete/{id}")
    public ResponseEntity<?> delete(@PathVariable Long id) {
        try {
            this.genderService.deleteGenderById(id);
            return ResponseEntity.noContent().build();
        } catch (RuntimeException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(e.getMessage());
        }
    }
}
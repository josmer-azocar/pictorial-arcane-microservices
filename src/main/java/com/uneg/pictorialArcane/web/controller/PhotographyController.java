package com.uneg.pictorialArcane.web.controller;

import com.uneg.pictorialArcane.domain.dto.request.ContainerPhotographyRequestDto;
import com.uneg.pictorialArcane.domain.dto.response.ContainerPhotographyResponseDto;
import com.uneg.pictorialArcane.domain.service.PhotographyService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/photography")
public class PhotographyController {

    private final PhotographyService photographyService;

    public PhotographyController(PhotographyService photographyService) {
        this.photographyService = photographyService;
    }

    @PostMapping("/add")
    @PreAuthorize("hasRole('ADMIN')")
    ResponseEntity<ContainerPhotographyResponseDto> addPhotography(@RequestBody @Valid ContainerPhotographyRequestDto photographyDto) {
        return ResponseEntity.status(HttpStatus.CREATED).body(this.photographyService.createPhotography(photographyDto));
    }
}

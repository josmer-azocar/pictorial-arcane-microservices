package com.uneg.pictorialArcane.web.controller;

import com.uneg.pictorialArcane.domain.dto.request.ContainerGoldsmithRequestDto;
import com.uneg.pictorialArcane.domain.dto.response.ContainerGoldsmithResponseDto;
import com.uneg.pictorialArcane.domain.service.GoldsmithService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/goldsmith")
public class GoldsmithController {
    private final GoldsmithService goldsmithService;

    public GoldsmithController(GoldsmithService goldsmithService) {
        this.goldsmithService = goldsmithService;
    }

    @PostMapping("/add")
    @PreAuthorize("hasRole('ADMIN')")
    ResponseEntity<ContainerGoldsmithResponseDto> addGoldsmith(@RequestBody @Valid ContainerGoldsmithRequestDto goldsmithDto) {
        return ResponseEntity.status(HttpStatus.CREATED).body(this.goldsmithService.createGoldsmith(goldsmithDto));
    }
}

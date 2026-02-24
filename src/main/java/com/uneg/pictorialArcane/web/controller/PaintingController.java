package com.uneg.pictorialArcane.web.controller;

import com.uneg.pictorialArcane.domain.dto.request.ContainerPaintingRequestDto;
import com.uneg.pictorialArcane.domain.dto.response.ContainerPaintingResponseDto;
import com.uneg.pictorialArcane.domain.service.PaintingService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/painting")
public class PaintingController {

    private final PaintingService paintingService;

    public PaintingController(PaintingService paintingService) {
        this.paintingService = paintingService;
    }

    @PostMapping("/add")
    @PreAuthorize("hasRole('ADMIN')")
    ResponseEntity<ContainerPaintingResponseDto> addPainting(@RequestBody @Valid ContainerPaintingRequestDto paintingDto) {
        return ResponseEntity.status(HttpStatus.CREATED).body(this.paintingService.createPainting(paintingDto));
    }
}



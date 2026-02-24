package com.uneg.pictorialArcane.web.controller;

import com.uneg.pictorialArcane.domain.dto.request.ContainerCeramicRequestDto;
import com.uneg.pictorialArcane.domain.dto.response.ContainerCeramicResponseDto;
import com.uneg.pictorialArcane.domain.service.CeramicService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/ceramic")
public class CeramicController {

    private final CeramicService ceramicService;

    public CeramicController(CeramicService ceramicService) {
        this.ceramicService = ceramicService;
    }

    @PostMapping("/add")
    @PreAuthorize("hasRole('ADMIN')")
    ResponseEntity<ContainerCeramicResponseDto> addCeramic(@RequestBody @Valid ContainerCeramicRequestDto ceramicDto) {
        return ResponseEntity.status(HttpStatus.CREATED).body(this.ceramicService.createCeramic(ceramicDto));
    }
}

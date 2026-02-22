package com.uneg.pictorialArcane.web.controller;

import com.uneg.pictorialArcane.domain.dto.request.ContainerSculptureRequestDto;
import com.uneg.pictorialArcane.domain.dto.request.SculptureRequestDto;
import com.uneg.pictorialArcane.domain.dto.response.ContainerSculptureResponseDto;
import com.uneg.pictorialArcane.domain.dto.response.SculptureResponseDto;
import com.uneg.pictorialArcane.domain.service.SculptureService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import io.swagger.v3.oas.annotations.tags.Tag;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.Parameter;

@RestController
@RequestMapping("/sculpture")
@Tag(name = "Sculpture", description = "Sculpture management functions / Funciones de gestión de esculturas")
public class SculptureController {

    private final SculptureService sculptureService;


    public SculptureController(SculptureService sculptureService) {
        this.sculptureService = sculptureService;
    }

    @PostMapping("/add")
    @PreAuthorize("hasRole('ADMIN')")
    @Operation(
            summary = "Add new Sculpture / Agregar nueva escultura",
            description = "Requires ADMIN role. Creates a new sculpture. / Requiere rol ADMIN. Crea una nueva escultura.",
            responses = {
                    @ApiResponse(responseCode = "201", description = "Sculpture created successfully / Escultura creada exitosamente"),
                    @ApiResponse(responseCode = "400", description = "Invalid input data / Datos de entrada inválidos"),
                    @ApiResponse(responseCode = "404", description = "Art Work not found / Obra de arte no encontrada")
            }
    )
    ResponseEntity<ContainerSculptureResponseDto> addSculpture(@Parameter(description = "Sculpture data / Datos de la escultura") @RequestBody @Valid ContainerSculptureResponseDto sculptureDto){
        return ResponseEntity.status(HttpStatus.CREATED).body(this.sculptureService.createSculpture(sculptureDto));
    }
}
package com.uneg.pictorialArcane.web.controller;

import com.uneg.pictorialArcane.domain.service.GenderService;
import com.uneg.pictorialArcane.persistence.entity.GenderEntity;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/gender")
@Tag(name = "Gender", description = "Gender management functions / Funciones de gestión de géneros")
public class GenderController {

    private final GenderService genderService;

    public GenderController(GenderService genderService) { this.genderService = genderService; }

    @GetMapping("/all")
    @Operation(
            summary = "Get all Genders / Obtener todos los géneros",
            description = "Returns a list of all genders / Retorna una lista de todos los géneros",
            responses = {
                    @ApiResponse(responseCode = "200", description = "List of genders retrieved successfully / Lista de géneros obtenida exitosamente")
            }
    )
    public ResponseEntity<List<GenderEntity>> getAllGender() {
        return ResponseEntity.ok(this.genderService.getAllGender());
    }

    @PostMapping("/add")
    @Operation(
            summary = "Add new Gender / Agregar nuevo género",
            description = "Creates a new gender / Crea un nuevo género",
            responses = {
                    @ApiResponse(responseCode = "200", description = "Gender created successfully / Género creado exitosamente")
            }
    )
    public ResponseEntity<GenderEntity> add(@Parameter(description = "Gender data / Datos del género",
                                                       example = """
                                                               {
                                                                   "name": "Painting",
                                                                   "description": "Visual art created by applying pigment..."
                                                               }""")
                                                @RequestBody GenderEntity gender) {
        return ResponseEntity.ok(this.genderService.saveGender(gender));
    }
    @GetMapping("/{id}")
    @Operation(
            summary = "Get Gender by ID / Obtener género por ID",
            description = "Returns a gender by its ID / Retorna un género por su ID",
            responses = {
                    @ApiResponse(responseCode = "200", description = "Gender retrieved successfully / Género obtenido exitosamente"),
                    @ApiResponse(responseCode = "404", description = "Gender not found / Género no encontrado")
            }
    )
    ResponseEntity<?> getGenderById(@Parameter(description = "Gender ID / ID del género") @PathVariable Long id){
        try{
            GenderEntity gender = this.genderService.getGenderById(id);
            return ResponseEntity.ok(gender); //devuelve un codigo 200 con el objeto
        } catch (RuntimeException e) {
            //error 404 no encontrado
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body("gender not found");
        }
    }

    @DeleteMapping("/delete/{id}")
    @Operation(
            summary = "Delete Gender by ID / Eliminar género por ID",
            description = "Deletes a gender by its ID / Elimina un género por su ID",
            responses = {
                    @ApiResponse(responseCode = "204", description = "Gender deleted successfully / Género eliminado exitosamente"),
                    @ApiResponse(responseCode = "404", description = "Gender not found / Género no encontrado")
            }
    )
    public ResponseEntity<?> delete(@Parameter(description = "Gender ID / ID del género") @PathVariable Long id) {
        try {
            this.genderService.deleteGenderById(id);
            return ResponseEntity.noContent().build();
        } catch (RuntimeException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(e.getMessage());
        }
    }
}
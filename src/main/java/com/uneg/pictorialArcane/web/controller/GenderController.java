package com.uneg.pictorialArcane.web.controller;

import com.uneg.pictorialArcane.domain.dto.request.GenderRequestDto;
import com.uneg.pictorialArcane.domain.dto.response.GenderResponseDto;
import com.uneg.pictorialArcane.domain.dto.update.UpdateGenderDto;
import com.uneg.pictorialArcane.domain.service.GenderService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/gender")
@Tag(name = "Gender", description = "Gender management functions / Funciones de gestión de géneros")
public class GenderController {

    private final GenderService genderService;

    public GenderController(GenderService genderService) { this.genderService = genderService; }

    @PreAuthorize("permitAll()")
    @GetMapping("/all")
    @Operation(
            summary = "Get all Genders / Obtener todos los géneros",
            description = "Returns a list of all genders / Retorna una lista de todos los géneros",
            responses = {
                    @ApiResponse(responseCode = "200", description = "List of genders retrieved successfully / Lista de géneros obtenida exitosamente")
            }
    )
    public ResponseEntity<List<GenderResponseDto>> getAllGender() {
        return ResponseEntity.ok(this.genderService.getAllGender());
    }

    @PreAuthorize("hasRole('ADMIN')")
    @PostMapping("/add")
    @Operation(
            summary = "Add new Gender / Agregar nuevo género",
            description = "Creates a new gender / Crea un nuevo género",
            responses = {
                    @ApiResponse(responseCode = "201", description = "Gender created successfully / Género creado exitosamente"),
                    @ApiResponse(responseCode = "400", description = "Invalid input data / Datos de entrada inválidos")
            }
    )
    public ResponseEntity<GenderResponseDto> add(@Parameter(description = "Gender data / Datos del género",
                                                       example = """
                                                               {
                                                                   \"name\": \"Painting\",
                                                                   \"description\": \"Visual art created by applying pigment...\"
                                                               }""")
                                                @RequestBody @Valid GenderRequestDto gender) {
        return ResponseEntity.status(HttpStatus.CREATED).body(this.genderService.addGender(gender));
    }

    @PreAuthorize("permitAll()")
    @GetMapping("/{id}")
    @Operation(
            summary = "Get Gender by ID / Obtener género por ID",
            description = "Returns a gender by its ID / Retorna un género por su ID",
            responses = {
                    @ApiResponse(responseCode = "200", description = "Gender retrieved successfully / Género obtenido exitosamente"),
                    @ApiResponse(responseCode = "404", description = "Gender not found / Género no encontrado")
            }
    )
    ResponseEntity<GenderResponseDto> getGenderById(@Parameter(description = "Gender ID / ID del género") @PathVariable Long id){
        return ResponseEntity.ok(this.genderService.getGenderById(id));
    }

    @PreAuthorize("hasRole('ADMIN')")
    @PutMapping("/update/{id}")
    @Operation(
            summary = "Update Gender / Actualizar género",
            description = "Updates an existing gender / Actualiza un género existente",
            responses = {
                    @ApiResponse(responseCode = "200", description = "Gender updated successfully / Género actualizado exitosamente"),
                    @ApiResponse(responseCode = "400", description = "Invalid input data / Datos de entrada inválidos"),
                    @ApiResponse(responseCode = "404", description = "Gender not found / Género no encontrado")
            }
    )
    ResponseEntity<GenderResponseDto> updateGender(@Parameter(description = "Gender ID / ID del género") @PathVariable Long id,
                                                   @Parameter(description = "Updated gender data / Datos actualizados del género",
                                                              example = """
                                                                      {
                                                                          \"name\": \"Painting\",
                                                                          \"description\": \"Updated description...\"
                                                                      }""")
                                                   @RequestBody @Valid UpdateGenderDto gender){
        return ResponseEntity.ok(this.genderService.updateGender(id, gender));
    }

    @PreAuthorize("hasRole('ADMIN')")
    @DeleteMapping("/delete/{id}")
    @Operation(
            summary = "Delete Gender by ID / Eliminar género por ID",
            description = "Deletes a gender by its ID / Elimina un género por su ID",
            responses = {
                    @ApiResponse(responseCode = "204", description = "Gender deleted successfully / Género eliminado exitosamente"),
                    @ApiResponse(responseCode = "404", description = "Gender not found / Género no encontrado")
            }
    )
    public ResponseEntity<Void> delete(@Parameter(description = "Gender ID / ID del género") @PathVariable Long id) {
        this.genderService.deleteGenderById(id);
        return ResponseEntity.noContent().build();
    }
}
package com.uneg.pictorialArcane.web.controller;

import com.uneg.pictorialArcane.domain.dto.request.ArtWorkRequestDto;
import com.uneg.pictorialArcane.domain.dto.response.ArtWork2ResponseDto;
import com.uneg.pictorialArcane.domain.dto.response.ArtWorkResponseDto;
import com.uneg.pictorialArcane.domain.dto.update.UpdateArtWorkDto;
import com.uneg.pictorialArcane.domain.service.ArtWorkService;
import com.uneg.pictorialArcane.persistence.entity.ArtWorkEntity;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.tags.Tag;
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
@Tag(name = "ArtWork", description = "Art Work management functions / Funciones de gestión de obras de arte")
public class ArtWorkController {

    //Inyeccion del Service
    private final ArtWorkService artWorkService;
    public ArtWorkController(ArtWorkService artWorkService) {
        this.artWorkService = artWorkService;
    }

    //Metodos HTTP
    @PostMapping("/addArtWork")
    @PreAuthorize("hasRole('ADMIN')")
    @Operation(
            summary = "Add a new Art Work / Agregar una nueva obra de arte",
            description = "Requires ADMIN role. Returns the created Art Work. / Requiere rol ADMIN. Retorna la obra de arte creada.",
            responses = {
                    @ApiResponse(responseCode = "201", description = "Art Work created successfully / Obra de arte creada exitosamente"),
                    @ApiResponse(responseCode = "400", description = "Invalid input data / Datos de entrada inválidos"),
                    @ApiResponse(responseCode = "404", description = "Artist or Gender not found / Artista o Género no encontrado")
            }
    )
    ResponseEntity<ArtWorkResponseDto> addArtWork(@Parameter(description = "ArtWork data / Datos de la obra de arte",
                                                             example = """
                                                                     {
                                                                         "name": "Mona Lisa",
                                                                         "status": "Available",
                                                                         "price": 1000000.0,
                                                                         "idArtist": 1,
                                                                         "idGender": 1
                                                                     }""")
                                                      @RequestBody @Valid ArtWorkRequestDto artWork){
        return ResponseEntity.status(HttpStatus.CREATED).body(this.artWorkService.addArtWork(artWork));
    }

    @GetMapping("/all")
    @Operation(
            summary = "Get all Art Works / Obtener todas las obras de arte",
            description = "Returns a list of all art works / Retorna una lista de todas las obras de arte",
            responses = {
                    @ApiResponse(responseCode = "200", description = "List of art works retrieved successfully / Lista de obras de arte obtenida exitosamente")
            }
    )
    ResponseEntity<List<ArtWorkEntity>> getAllArtWorks(){
        return ResponseEntity.ok(this.artWorkService.getAllArtWorks());
    }

    @GetMapping("/{id}")
    @Operation(
            summary = "Get Art Work by ID / Obtener obra de arte por ID",
            description = "Returns an art work by its ID / Retorna una obra de arte por su ID",
            responses = {
                    @ApiResponse(responseCode = "200", description = "Art Work retrieved successfully / Obra de arte obtenida exitosamente"),
                    @ApiResponse(responseCode = "404", description = "Art Work not found / Obra de arte no encontrada")

            }
    )
    ResponseEntity<ArtWorkResponseDto> getArtWorkById(@Parameter(description = "Art Work ID / ID de la obra de arte") @PathVariable Long id){
        return ResponseEntity.ok(this.artWorkService.getArtWorkById(id));
    }

    @DeleteMapping("/delete/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    @Operation(
            summary = "Delete Art Work by ID / Eliminar obra de arte por ID",
            description = "Requires ADMIN role. Deletes an art work by its ID / Requiere rol ADMIN. Elimina una obra de arte por su ID",
            responses = {
                    @ApiResponse(responseCode = "204", description = "Art Work deleted successfully / Obra de arte eliminada exitosamente"),
                    @ApiResponse(responseCode = "404", description = "Art Work not found / Obra de arte no encontrada")
            }
    )
    ResponseEntity<Void> deleteArtWorkById(@Parameter(description = "Art Work ID / ID de la obra de arte") @PathVariable Long id){
        this.artWorkService.deleteArtWorkById(id);
        return ResponseEntity.noContent().build();
    }

    @PutMapping("/update/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    @Operation(
            summary = "Update Art Work / Actualizar obra de arte",
            description = "Requires ADMIN role. Updates an existing art work. / Requiere rol ADMIN. Actualiza una obra de arte existente.",
            responses = {
                    @ApiResponse(responseCode = "200", description = "Art Work updated successfully / Obra de arte actualizada exitosamente"),
                    @ApiResponse(responseCode = "400", description = "Invalid input data / Datos de entrada inválidos"),
                    @ApiResponse(responseCode = "404", description = "Art Work not found / Obra de arte no encontrada")
            }
    )
    ResponseEntity<ArtWorkResponseDto> update(@Parameter(description = "Art Work ID / ID de la obra de arte") @PathVariable Long id,
                                              @Parameter(description = "Updated ArtWork data / Datos actualizados de la obra de arte",
                                                         example = """
                                                                 {
                                                                     "name": "Mona Lisa Updated",
                                                                     "status": "Sold",
                                                                     "price": 2000000.0
                                                                 }""")
                                              @RequestBody @Valid UpdateArtWorkDto artWorkDto){
        return ResponseEntity.ok(this.artWorkService.updateArtWork(id, artWorkDto));
    }

    @GetMapping("/search")
    @Operation(
            summary = "Search Art Works with filters / Buscar obras de arte con filtros",
            description = "Search and filter art works by gender, artist, title, price range with pagination. / Busca y filtra obras de arte por género, artista, título, rango de precio con paginación.",
            responses = {
                    @ApiResponse(responseCode = "200", description = "Page of Art Works retrieved successfully / Página de obras de arte obtenida exitosamente"),
                    @ApiResponse(responseCode = "400", description = "Invalid filter parameters / Parámetros de filtro inválidos")
            }
    )
    public ResponseEntity<Page<ArtWork2ResponseDto>> searchArtWorks(
            @Parameter(description = "Gender ID / ID del género") @RequestParam(required = false) Long idGender,
            @Parameter(description = "Artist ID / ID del artista") @RequestParam(required = false) Long idArtist,
            @Parameter(description = "Title (partial match) / Título (coincidencia parcial)") @RequestParam(required = false, defaultValue = "") String title,
            @Parameter(description = "Minimum price / Precio mínimo") @RequestParam(required = false) Double min,
            @Parameter(description = "Maximum price / Precio máximo") @RequestParam(required = false) Double max,
            @Parameter(description = "Pagination information / Información de paginación", hidden = true) @PageableDefault(size = 9, sort = "price", direction = Sort.Direction.ASC) Pageable pageable
    ) {
        // Pageable ya trae: página actual, cuántos elementos traer y el ordenamiento
        Page<ArtWork2ResponseDto> pageResults = artWorkService.filterArtWorks(idGender, idArtist, title, min, max, pageable);
        return ResponseEntity.ok(pageResults);
    }
}

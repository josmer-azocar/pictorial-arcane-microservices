package com.uneg.pictorialArcane.web.controller;

import com.uneg.pictorialArcane.domain.dto.request.GenreRequestDto;
import com.uneg.pictorialArcane.domain.dto.response.GenreResponseDto;
import com.uneg.pictorialArcane.domain.dto.update.UpdateGenreDto;
import com.uneg.pictorialArcane.domain.service.GenreService;
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
@RequestMapping("/genre")
@Tag(name = "Genre", description = "Genre management functions / Funciones de gestión de géneros")
public class GenreController {

    private final GenreService genreService;

    public GenreController(GenreService genreService) { this.genreService = genreService; }

    @PreAuthorize("permitAll()")
    @GetMapping("/all")
    @Operation(
            summary = "Get all Genres / Obtener todos los géneros",
            description = "Returns a list of all genres / Retorna una lista de todos los géneros",
            responses = {
                    @ApiResponse(responseCode = "200", description = "List of genres retrieved successfully / Lista de géneros obtenida exitosamente")
            }
    )
    public ResponseEntity<List<GenreResponseDto>> getAllGenre() {
        return ResponseEntity.ok(this.genreService.getAllGenre());
    }

    @PreAuthorize("hasRole('ADMIN')")
    @PostMapping("/add")
    @Operation(
            summary = "Add new Genre / Agregar nuevo género",
            description = "Creates a new genre / Crea un nuevo género",
            responses = {
                    @ApiResponse(responseCode = "201", description = "Genre created successfully / Género creado exitosamente"),
                    @ApiResponse(responseCode = "400", description = "Invalid input data / Datos de entrada inválidos")
            }
    )
    public ResponseEntity<GenreResponseDto> add(@Parameter(description = "Genre data / Datos del género",
                                                       example = "{\"name\": \"Painting\", \"description\": \"Visual art created by applying pigment...\"}")
                                                @RequestBody @Valid GenreRequestDto genre) {
        return ResponseEntity.status(HttpStatus.CREATED).body(this.genreService.addGenre(genre));
    }

    @PreAuthorize("permitAll()")
    @GetMapping("/{id}")
    @Operation(
            summary = "Get Genre by ID / Obtener género por ID",
            description = "Returns a genre by its ID / Retorna un género por su ID",
            responses = {
                    @ApiResponse(responseCode = "200", description = "Genre retrieved successfully / Género obtenido exitosamente"),
                    @ApiResponse(responseCode = "404", description = "Genre not found / Género no encontrado")
            }
    )
    ResponseEntity<GenreResponseDto> getGenreById(@Parameter(description = "Genre ID / ID del género") @PathVariable Long id){
        return ResponseEntity.ok(this.genreService.getGenreById(id));
    }

    @PreAuthorize("hasRole('ADMIN')")
    @PutMapping("/update/{id}")
    @Operation(
            summary = "Update Genre / Actualizar género",
            description = "Updates an existing genre / Actualiza un género existente",
            responses = {
                    @ApiResponse(responseCode = "200", description = "Genre updated successfully / Género actualizado exitosamente"),
                    @ApiResponse(responseCode = "400", description = "Invalid input data / Datos de entrada inválidos"),
                    @ApiResponse(responseCode = "404", description = "Genre not found / Género no encontrado")
            }
    )
    ResponseEntity<GenreResponseDto> updateGenre(@Parameter(description = "Genre ID / ID del género") @PathVariable Long id,
                                                   @Parameter(description = "Updated genre data / Datos actualizados del género",
                                                              example = "{\"name\": \"Painting\", \"description\": \"Updated description...\"}")
                                                   @RequestBody @Valid UpdateGenreDto genre){
        return ResponseEntity.ok(this.genreService.updateGenre(id, genre));
    }

    @PreAuthorize("hasRole('ADMIN')")
    @DeleteMapping("/delete/{id}")
    @Operation(
            summary = "Delete Genre by ID / Eliminar género por ID",
            description = "Deletes a genre by its ID / Elimina un género por su ID",
            responses = {
                    @ApiResponse(responseCode = "204", description = "Genre deleted successfully / Género eliminado exitosamente"),
                    @ApiResponse(responseCode = "404", description = "Genre not found / Género no encontrado")
            }
    )
    public ResponseEntity<Void> delete(@Parameter(description = "Genre ID / ID del género") @PathVariable Long id) {
        this.genreService.deleteGenreById(id);
        return ResponseEntity.noContent().build();
    }
}
package com.uneg.pictorialArcane.web.controller;

import com.uneg.pictorialArcane.domain.dto.request.ArtistRequestDto;
import com.uneg.pictorialArcane.domain.dto.response.ArtistResponseDto;
import com.uneg.pictorialArcane.domain.dto.update.UpdateArtistDto;
import com.uneg.pictorialArcane.domain.service.ArtistService;
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
@RequestMapping("/artist")
@Tag(name = "Artist", description = "Artist management functions / Funciones de gestión de artistas")
public class ArtistController {

    private final ArtistService artistService;

    public ArtistController(ArtistService artistService) {
        this.artistService = artistService;
    }

    @PostMapping("/add")
    @PreAuthorize("hasRole('ADMIN')")
    @Operation(
            summary = "Add a new Artist / Agregar un nuevo artista",
            description = "Requires ADMIN role. Returns the created Artist. / Requiere rol ADMIN. Retorna el artista creado.",
            responses = {
                    @ApiResponse(responseCode = "201", description = "Artist created successfully / Artista creado exitosamente"),
                    @ApiResponse(responseCode = "400", description = "Invalid input data / Datos de entrada inválidos")
            }
    )
    ResponseEntity<ArtistResponseDto> addArtist(@Parameter(description = "Artist data / Datos del artista",
                                                           example = """
                                                                   {
                                                                       "name": "Leonardo",
                                                                       "lastName": "da Vinci",
                                                                       "nationality": "Italian",
                                                                       "biography": "Renaissance polymath..."
                                                                   }""")
                                                    @RequestBody @Valid ArtistRequestDto artist){
        return ResponseEntity.status(HttpStatus.CREATED).body(this.artistService.addArtist(artist));
    }

    @PreAuthorize("permitAll()")
    @GetMapping("/all")
    @Operation(
            summary = "Get all Artists / Obtener todos los artistas",
            description = "Returns a list of all artists / Retorna una lista de todos los artistas",
            responses = {
                    @ApiResponse(responseCode = "200", description = "List of artists retrieved successfully / Lista de artistas obtenida exitosamente")
            }
    )
    ResponseEntity<List<ArtistResponseDto>> getAllArtist(){
        return ResponseEntity.ok(this.artistService.getAllArtist());
    }

    @PreAuthorize("permitAll()")
    @GetMapping("/{id}")
    @Operation(
            summary = "Get Artist by ID / Obtener artista por ID",
            description = "Returns an artist by their ID / Retorna un artista por su ID",
            responses = {
                    @ApiResponse(responseCode = "200", description = "Artist retrieved successfully / Artista obtenido exitosamente"),
                    @ApiResponse(responseCode = "404", description = "Artist not found / Artista no encontrado")
            }
    )
    ResponseEntity<ArtistResponseDto> getArtistById(@Parameter(description = "Artist ID / ID del artista") @PathVariable Long id){
        return ResponseEntity.ok(this.artistService.getArtistById(id));
    }

    @PutMapping("/update/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    @Operation(
            summary = "Update Artist / Actualizar artista",
            description = "Requires ADMIN role. Updates an existing artist / Requiere rol ADMIN. Actualiza un artista existente",
            responses = {
                    @ApiResponse(responseCode = "200", description = "Artist updated successfully / Artista actualizado exitosamente"),
                    @ApiResponse(responseCode = "400", description = "Invalid input data / Datos de entrada inválidos"),
                    @ApiResponse(responseCode = "404", description = "Artist not found / Artista no encontrado")
            }
    )
    ResponseEntity<ArtistResponseDto> updateArtist(@Parameter(description = "Artist ID / ID del artista") @PathVariable Long id,
                                                   @Parameter(description = "Updated artist data / Datos actualizados del artista",
                                                              example = """
                                                                      {
                                                                          "name": "Leonardo",
                                                                          "lastName": "da Vinci",
                                                                          "nationality": "Italian",
                                                                          "biography": "Updated biography..."
                                                                      }""")
                                                       @RequestBody @Valid UpdateArtistDto artist){
        return ResponseEntity.ok(this.artistService.updateArtist(id, artist));
    }

    @DeleteMapping("/delete/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    @Operation(
            summary = "Delete Artist by ID / Eliminar artista por ID",
            description = "Requires ADMIN role. Deletes an artist by their ID / Requiere rol ADMIN. Elimina un artista por su ID",
            responses = {
                    @ApiResponse(responseCode = "204", description = "Artist deleted successfully / Artista eliminado exitosamente"),
                    @ApiResponse(responseCode = "404", description = "Artist not found / Artista no encontrado")
            }
    )
    ResponseEntity<Void> deleteArtistById(@Parameter(description = "Artist ID / ID del artista") @PathVariable Long id){
        this.artistService.deleteArtistById(id);
        return ResponseEntity.noContent().build();
    }

}
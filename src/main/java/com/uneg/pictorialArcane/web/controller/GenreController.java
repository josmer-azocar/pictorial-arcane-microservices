package com.uneg.pictorialArcane.web.controller;

import com.uneg.pictorialArcane.domain.dto.request.GenreRequestDto;
import com.uneg.pictorialArcane.domain.dto.response.ArtistResponseDto;
import com.uneg.pictorialArcane.domain.dto.response.GenreResponseDto;
import com.uneg.pictorialArcane.domain.dto.update.UpdateGenreDto;
import com.uneg.pictorialArcane.domain.service.ArtistService;
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
    private final ArtistService artistService;

    public GenreController(GenreService genreService, ArtistService artistService) {
        this.genreService = genreService;
        this.artistService = artistService;
    }

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

    @PreAuthorize("hasRole('ADMIN')")
    @PostMapping("/assign")
    @Operation(
            summary = "Assign Genre to Artist / Asignar género a artista",
            description = "Assigns a genre to an artist. If the artist already has that genre, throws an exception / Asigna un género a un artista. Si el artista ya posee ese género, lanza una excepción",
            responses = {
                    @ApiResponse(responseCode = "200", description = "Genre assigned successfully / Género asignado exitosamente"),
                    @ApiResponse(responseCode = "400", description = "Artist already has the genre / El artista ya posee el género"),
                    @ApiResponse(responseCode = "404", description = "Artist or Genre not found / Artista o Género no encontrado")
            }
    )
    public ResponseEntity<Void> assignGenreToArtist(
            @Parameter(description = "Artist ID / ID del artista") @RequestParam Long idArtist,
            @Parameter(description = "Genre ID / ID del género") @RequestParam Long idGenre
    ) {
        this.artistService.assignGenreToArtist(idArtist, idGenre);
        return ResponseEntity.ok().build();
    }

    @PreAuthorize("hasRole('ADMIN')")
    @DeleteMapping("/unassign")
    @Operation(
            summary = "Unassign Genre from Artist / Desasignar género a artista",
            description = "Unassigns a genre from an artist. If the artist does not have that genre, throws an exception / Desasigna un género de un artista. Si el artista no posee ese género, lanza una excepción",
            responses = {
                    @ApiResponse(responseCode = "200", description = "Genre unassigned successfully / Género desasignado exitosamente"),
                    @ApiResponse(responseCode = "400", description = "Artist does not have the genre / El artista no posee el género"),
                    @ApiResponse(responseCode = "404", description = "Artist or Genre not found / Artista o Género no encontrado")
            }
    )
    public ResponseEntity<Void> unassignGenreFromArtist(
            @Parameter(description = "Artist ID / ID del artista") @RequestParam Long idArtist,
            @Parameter(description = "Genre ID / ID del género") @RequestParam Long idGenre
    ) {
        this.artistService.unassignGenreFromArtist(idArtist, idGenre);
        return ResponseEntity.ok().build();
    }

    @PreAuthorize("permitAll()")
    @GetMapping("/getAllByArtist")
    @Operation(
            summary = "Get genres by Artist ID / Obtener géneros por ID de artista",
            description = "Returns the list of genres assigned to an artist / Retorna la lista de géneros asignados a un artista",
            responses = {
                    @ApiResponse(responseCode = "200", description = "Genres retrieved successfully / Géneros obtenidos exitosamente"),
                    @ApiResponse(responseCode = "404", description = "Artist not found / Artista no encontrado")
            }
    )
    public ResponseEntity<List<GenreResponseDto>> getGenresByArtistId(
            @Parameter(description = "Artist ID / ID del artista") @RequestParam Long idArtist
    ) {
        return ResponseEntity.ok(this.artistService.getGenresByArtistId(idArtist));
    }

    @PreAuthorize("permitAll()")
    @GetMapping("/getAllArtistsByGenre")
    @Operation(
            summary = "Get artists by Genre ID / Obtener artistas por ID de género",
            description = "Returns the list of artists assigned to a genre / Retorna la lista de artistas asignados a un género",
            responses = {
                    @ApiResponse(responseCode = "200", description = "Artists retrieved successfully / Artistas obtenidos exitosamente"),
                    @ApiResponse(responseCode = "404", description = "Genre not found / Género no encontrado")
            }
    )
    public ResponseEntity<List<ArtistResponseDto>> getArtistsByGenreId(
            @Parameter(description = "Genre ID / ID del género") @RequestParam Long idGenre
    ) {
        return ResponseEntity.ok(this.artistService.getArtistsByGenreId(idGenre));
    }

}
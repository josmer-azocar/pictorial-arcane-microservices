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
import com.uneg.pictorialArcane.domain.dto.request.ContainerCeramicRequestDto;
import com.uneg.pictorialArcane.domain.dto.request.ContainerGoldsmithRequestDto;
import com.uneg.pictorialArcane.domain.dto.request.ContainerPaintingRequestDto;
import com.uneg.pictorialArcane.domain.dto.request.ContainerPhotographyRequestDto;
import com.uneg.pictorialArcane.domain.dto.request.ContainerSculptureRequestDto;
import com.uneg.pictorialArcane.domain.dto.response.ContainerCeramicResponseDto;
import com.uneg.pictorialArcane.domain.dto.response.ContainerGoldsmithResponseDto;
import com.uneg.pictorialArcane.domain.dto.response.ContainerPaintingResponseDto;
import com.uneg.pictorialArcane.domain.dto.response.ContainerPhotographyResponseDto;
import com.uneg.pictorialArcane.domain.dto.response.ContainerSculptureResponseDto;
import com.uneg.pictorialArcane.domain.service.CeramicService;
import com.uneg.pictorialArcane.domain.service.GoldsmithService;
import com.uneg.pictorialArcane.domain.service.PaintingService;
import com.uneg.pictorialArcane.domain.service.PhotographyService;
import com.uneg.pictorialArcane.domain.service.SculptureService;


@RestController
@RequestMapping("/artwork")
@Tag(name = "ArtWork", description = "Art Work management functions / Funciones de gestión de obras de arte")
public class ArtWorkController {

   
    private final ArtWorkService artWorkService;
    private final CeramicService ceramicService;
    private final GoldsmithService goldsmithService;
    private final PaintingService paintingService;
    private final PhotographyService photographyService;
    private final SculptureService sculptureService;

    public ArtWorkController(ArtWorkService artWorkService,
                             CeramicService ceramicService,
                             GoldsmithService goldsmithService,
                             PaintingService paintingService,
                             PhotographyService photographyService,
                             SculptureService sculptureService) {
        this.artWorkService = artWorkService;
        this.ceramicService = ceramicService;
        this.goldsmithService = goldsmithService;
        this.paintingService = paintingService;
        this.photographyService = photographyService;
        this.sculptureService = sculptureService;
    }


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

    @PreAuthorize("permitAll()")
    @GetMapping("/all")
    @Operation(
            summary = "Get all Art Works / Obtener todas las obras de arte",
            description = "Returns a list of all art works / Retorna una lista de todas las obras de arte",
            responses = {
                    @ApiResponse(responseCode = "200", description = "List of art works retrieved successfully / Lista de obras de arte obtenida exitosamente")
            }
    )
    ResponseEntity<List<ArtWorkResponseDto>> getAllArtWorks(){
        return ResponseEntity.ok(this.artWorkService.getAllArtWorks());
    }

    @PreAuthorize("permitAll()")
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
    @PreAuthorize("permitAll()")
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

    @PostMapping("/ceramic/add")
    @PreAuthorize("hasRole('ADMIN')")
    @Operation(
            summary = "Add new Ceramic / Agregar nueva cerámica",
            description = "Requires ADMIN role. Creates a new ceramic art work. / Requiere rol ADMIN. Crea una nueva obra de cerámica.",
            responses = {
                    @ApiResponse(responseCode = "201", description = "Ceramic created successfully / Cerámica creada exitosamente"),
                    @ApiResponse(responseCode = "400", description = "Invalid input data / Datos de entrada inválidos"),
                    @ApiResponse(responseCode = "404", description = "Art Work not found / Obra de arte no encontrada")
            }
    )
    ResponseEntity<ContainerCeramicResponseDto> addCeramic(@RequestBody @Valid ContainerCeramicRequestDto ceramicDto) {
        return ResponseEntity.status(HttpStatus.CREATED).body(this.ceramicService.createCeramic(ceramicDto));
    }

    @PostMapping("/goldsmith/add")
    @PreAuthorize("hasRole('ADMIN')")
    @Operation(
            summary = "Add new Goldsmith / Agregar nueva orfebrería",
            description = "Requires ADMIN role. Creates a new goldsmith art work. / Requiere rol ADMIN. Crea una nueva obra de orfebrería.",
            responses = {
                    @ApiResponse(responseCode = "201", description = "Goldsmith created successfully / Orfebrería creada exitosamente"),
                    @ApiResponse(responseCode = "400", description = "Invalid input data / Datos de entrada inválidos"),
                    @ApiResponse(responseCode = "404", description = "Art Work not found / Obra de arte no encontrada")
            }
    )
    ResponseEntity<ContainerGoldsmithResponseDto> addGoldsmith(@RequestBody @Valid ContainerGoldsmithRequestDto goldsmithDto) {
        return ResponseEntity.status(HttpStatus.CREATED).body(this.goldsmithService.createGoldsmith(goldsmithDto));
    }

    @PostMapping("/painting/add")
    @PreAuthorize("hasRole('ADMIN')")
    @Operation(
            summary = "Add new Painting / Agregar nueva pintura",
            description = "Requires ADMIN role. Creates a new painting art work. / Requiere rol ADMIN. Crea una nueva obra de pintura.",
            responses = {
                    @ApiResponse(responseCode = "201", description = "Painting created successfully / Pintura creada exitosamente"),
                    @ApiResponse(responseCode = "400", description = "Invalid input data / Datos de entrada inválidos"),
                    @ApiResponse(responseCode = "404", description = "Art Work not found / Obra de arte no encontrada")
            }
    )
    ResponseEntity<ContainerPaintingResponseDto> addPainting(@RequestBody @Valid ContainerPaintingRequestDto paintingDto) {
        return ResponseEntity.status(HttpStatus.CREATED).body(this.paintingService.createPainting(paintingDto));
    }

    @PostMapping("/photography/add")
    @PreAuthorize("hasRole('ADMIN')")
    @Operation(
            summary = "Add new Photography / Agregar nueva fotografía",
            description = "Requires ADMIN role. Creates a new photography art work. / Requiere rol ADMIN. Crea una nueva obra de fotografía.",
            responses = {
                    @ApiResponse(responseCode = "201", description = "Photography created successfully / Fotografía creada exitosamente"),
                    @ApiResponse(responseCode = "400", description = "Invalid input data / Datos de entrada inválidos"),
                    @ApiResponse(responseCode = "404", description = "Art Work not found / Obra de arte no encontrada")
            }
    )
    ResponseEntity<ContainerPhotographyResponseDto> addPhotography(@RequestBody @Valid ContainerPhotographyRequestDto photographyDto) {
        return ResponseEntity.status(HttpStatus.CREATED).body(this.photographyService.createPhotography(photographyDto));
    }

    @PostMapping("/sculpture/add")
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
    ResponseEntity<ContainerSculptureResponseDto> addSculpture(@RequestBody @Valid ContainerSculptureRequestDto sculptureDto) {
        return ResponseEntity.status(HttpStatus.CREATED).body(this.sculptureService.createSculpture(sculptureDto));
    }

    // Nuevo endpoint: obtener el contenedor específico (subtipo) de una obra por su id
    @GetMapping("/search/specificArtWork/{id}")
    @Operation(
            summary = "Get specific Art Work subtype container by ArtWork ID / Obtener el contenedor específico de una obra por su ID",
            description = "Dado el ID de la obra, detecta su género/subtipo (ceramic, painting, photography, sculpture, goldsmith, etc.) y retorna el ContainerXResponseDto correspondiente.",
            responses = {
                    @ApiResponse(responseCode = "200", description = "Subtype container retrieved successfully / Contenedor de subtipo obtenido exitosamente"),
                    @ApiResponse(responseCode = "404", description = "Art Work not found or subtype not found / Obra de arte o subtipo no encontrado")
            }
    )
    @PreAuthorize("permitAll()")
    public ResponseEntity<?> getArtWorkContainerById(@Parameter(description = "Art Work ID / ID de la obra de arte") @PathVariable Long id) {
        // 1. Obtener la entidad de obra para conocer su género
        ArtWorkEntity artWorkEntity = this.artWorkService.getArtWorkEntityById(id);

        String genderName = artWorkEntity.getGender().getName();
        if (genderName == null) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body("La obra no tiene un género asociado");
        }

        // 2. Determinar el subtipo según el nombre del género
        String normalized = genderName.trim().toUpperCase();

        switch (normalized) {
            case "CERAMIC", "CERÁMICA", "CERAMICA" -> {
                ContainerCeramicResponseDto dto = this.ceramicService.getByArtWorkId(id);
                return ResponseEntity.ok(dto);
            }
            case "PAINTING", "PINTURA" -> {
                ContainerPaintingResponseDto dto = this.paintingService.getByArtWorkId(id);
                return ResponseEntity.ok(dto);
            }
            case "PHOTOGRAPHY", "FOTOGRAFÍA", "FOTOGRAFIA" -> {
                ContainerPhotographyResponseDto dto = this.photographyService.getByArtWorkId(id);
                return ResponseEntity.ok(dto);
            }
            case "SCULPTURE", "ESCULTURA" -> {
                ContainerSculptureResponseDto dto = this.sculptureService.getByArtWorkId(id);
                return ResponseEntity.ok(dto);
            }
            case "GOLDSMITH", "ORFEBRERÍA", "ORFEBRERIA" -> {
                ContainerGoldsmithResponseDto dto = this.goldsmithService.getByArtWorkId(id);
                return ResponseEntity.ok(dto);
            }
            default -> {
                // Género definido pero aún no soportado por un subtipo específico
                return ResponseEntity.status(HttpStatus.NOT_FOUND)
                        .body("No existe un subtipo manejado para el género: " + genderName);
            }
        }
    }
}

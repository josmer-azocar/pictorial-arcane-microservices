package com.uneg.pictorialArcane.web.controller;

import com.uneg.pictorialArcane.domain.azure.AzureBlobService;
import com.uneg.pictorialArcane.domain.dto.response.SaleResponseDto;
import com.uneg.pictorialArcane.domain.service.AdministrationService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/admin")
@PreAuthorize("hasRole('ADMIN')")
@Tag(name = "Admin", description = "Administrator management / Opciones administrativas")
public class AdministrationController {

    private final AdministrationService administrationService;
    private final AzureBlobService azureBlobService;

    public AdministrationController(AdministrationService administrationService, AzureBlobService azureBlobService) {
        this.administrationService = administrationService;
        this.azureBlobService = azureBlobService;
    }

    @GetMapping("/getAllPendingSales")
    @Operation(
            summary = "Get all pending sales in the last 24 hours/ Obtener todas las ventas pendientes en las ultimas 24 horas",
            description = "Requires ADMIN role. Returns pending sales or no content if empty. / Requiere rol ADMIN. Retorna ventas pendientes o no content si no hay.",
            responses = {
                    @ApiResponse(responseCode = "200", description = "Pending sales retrieved successfully / Ventas pendientes obtenidas exitosamente"),
                    @ApiResponse(responseCode = "204", description = "No pending sales / No hay ventas pendientes")
            }
    )
    ResponseEntity<List<SaleResponseDto>> getAllPendingSales(){
        if(this.administrationService.getAllPendingSales().isEmpty()){
            return ResponseEntity.noContent().build();
        }
        return ResponseEntity.ok(this.administrationService.getAllPendingSales());
    }

    @PutMapping("/rejectPendingSale/{saleId}")
    @Operation(
            summary = "Reject a pending sale / Rechazar una venta pendiente",
            description = "Requires ADMIN role. Rejects a pending sale by id using current user. / Requiere rol ADMIN. Rechaza una venta pendiente por id usando el usuario actual.",
            responses = {
                    @ApiResponse(responseCode = "200", description = "Pending sale rejected successfully / Venta pendiente rechazada exitosamente"),
                    @ApiResponse(responseCode = "404", description = "Pending sale not found / Venta pendiente no encontrada")
            }
    )
    ResponseEntity<Void> rejectPendingSale(@Parameter(description = "Sale ID / ID de la venta") @PathVariable Long saleId,
                                           Authentication authentication){
        this.administrationService.rejectPendingSale(saleId, authentication.getName());
        return ResponseEntity.ok().build();
    }

    @PostMapping("/{id}/artorkImage")
    @Operation(
            summary = "Upload artwork image / Subir imagen de obra",
            description = "Requires ADMIN role. Uploads artwork image for the given artwork id. / Requiere rol ADMIN. Sube la imagen de la obra para el id indicado.",
            responses = {
                    @ApiResponse(responseCode = "200", description = "Artwork image uploaded successfully / Imagen de obra subida exitosamente"),
                    @ApiResponse(responseCode = "400", description = "Invalid file or request / Archivo o solicitud invalida"),
                    @ApiResponse(responseCode = "404", description = "Artwork not found / Obra no encontrada"),
                    @ApiResponse(responseCode = "500", description = "Server error / Error del servidor")
            }
    )
    public ResponseEntity<?> uploadArtworkImage(@Parameter(description = "Artwork ID / ID de la obra") @PathVariable Long id,
                                                @Parameter(description = "Image file / Archivo de imagen") @RequestParam("file") MultipartFile file) {
        try {
            return ResponseEntity.ok(this.azureBlobService.uploadArtworkImage(id, file));
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.internalServerError().body("Error al subir la imagen: " + e.getMessage());
        }
    }

    @DeleteMapping("/{id}/artworkImage")
    @Operation(
            summary = "Delete artwork image / Eliminar imagen de obra",
            description = "Requires ADMIN role. Deletes artwork image for the given artwork id. / Requiere rol ADMIN. Elimina la imagen de la obra para el id indicado.",
            responses = {
                    @ApiResponse(responseCode = "200", description = "Artwork image deleted successfully / Imagen de obra eliminada exitosamente"),
                    @ApiResponse(responseCode = "404", description = "Artwork or image not found / Obra o imagen no encontrada"),
                    @ApiResponse(responseCode = "500", description = "Server error / Error del servidor")
            }
    )
    public ResponseEntity<?> deleteArtworkImage(@Parameter(description = "Artwork ID / ID de la obra") @PathVariable Long id) {
        try {
            return this.azureBlobService.deleteArtworkImage(id);
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.internalServerError().body(Map.of("error", "Error al procesar la solicitud: " + e.getMessage()));
        }
    }

    @PostMapping("/{id}/artistImage")
    @Operation(
            summary = "Upload artist image / Subir imagen de artista",
            description = "Requires ADMIN role. Uploads artist image for the given artist id. / Requiere rol ADMIN. Sube la imagen del artista para el id indicado.",
            responses = {
                    @ApiResponse(responseCode = "200", description = "Artist image uploaded successfully / Imagen de artista subida exitosamente"),
                    @ApiResponse(responseCode = "400", description = "Invalid file or request / Archivo o solicitud invalida"),
                    @ApiResponse(responseCode = "404", description = "Artist not found / Artista no encontrado"),
                    @ApiResponse(responseCode = "500", description = "Server error / Error del servidor")
            }
    )
    public ResponseEntity<?> uploadArtistImage(@Parameter(description = "Artist ID / ID del artista") @PathVariable Long id,
                                               @Parameter(description = "Image file / Archivo de imagen") @RequestParam("file") MultipartFile file) {
        try {
            return ResponseEntity.ok(this.azureBlobService.uploadArtistImage(id, file));
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.internalServerError().body("Error al subir la imagen: " + e.getMessage());
        }
    }

    @DeleteMapping("/{id}/artistImage")
    @Operation(
            summary = "Delete artist image / Eliminar imagen de artista",
            description = "Requires ADMIN role. Deletes artist image for the given artist id. / Requiere rol ADMIN. Elimina la imagen del artista para el id indicado.",
            responses = {
                    @ApiResponse(responseCode = "200", description = "Artist image deleted successfully / Imagen de artista eliminada exitosamente"),
                    @ApiResponse(responseCode = "404", description = "Artist or image not found / Artista o imagen no encontrada"),
                    @ApiResponse(responseCode = "500", description = "Server error / Error del servidor")
            }
    )
    public ResponseEntity<?> deleteArtistImage(@Parameter(description = "Artist ID / ID del artista") @PathVariable Long id) {
        try {
            return this.azureBlobService.deleteArtistImage(id);
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.internalServerError().body(Map.of("error", "Error al procesar la solicitud: " + e.getMessage()));
        }
    }
}

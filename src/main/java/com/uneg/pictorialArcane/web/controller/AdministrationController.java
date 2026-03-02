package com.uneg.pictorialArcane.web.controller;

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

import java.util.List;

@RestController
@RequestMapping("/admin")
@PreAuthorize("hasRole('ADMIN')")
@Tag(name = "Admin", description = "Administrator management / Opciones administrativas")
public class AdministrationController {

    private final AdministrationService administrationService;

    public AdministrationController(AdministrationService administrationService) {
        this.administrationService = administrationService;
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
}

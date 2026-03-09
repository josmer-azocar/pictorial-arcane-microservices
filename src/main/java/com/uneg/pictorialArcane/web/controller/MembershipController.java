package com.uneg.pictorialArcane.web.controller;

import com.uneg.pictorialArcane.domain.dto.response.MembershipResponseDto;
import com.uneg.pictorialArcane.domain.service.MembershipService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Sort;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;

@RestController
@RequestMapping("/membership")
@Tag(name = "Membership", description = "Membership management functions / Funciones de gestión de membresías")
public class MembershipController {

    private final MembershipService membershipService;

    public MembershipController(MembershipService membershipService) {
        this.membershipService = membershipService;
    }

    @Operation(summary = "Check for active membership / Verificar membresía activa")
    @ApiResponse(responseCode = "200", description = "Active membership found / Membresía activa encontrada")
    @ApiResponse(responseCode = "404", description = "No active membership found / No se encontró membresía activa")
    @GetMapping("/active")
    @PreAuthorize("hasAuthority('CLIENT')")
    public ResponseEntity<MembershipResponseDto> checkActiveMembership(Authentication authentication) {
        String email = authentication.getName();
        return ResponseEntity.ok(membershipService.getActiveMembership(email));
    }

    @Operation(summary = "Obtain or renew membership / Obtener o renovar membresía")
    @ApiResponse(responseCode = "200", description = "Membership created/renewed successfully / Membresía creada/renovada exitosamente")
    @ApiResponse(responseCode = "400", description = "Active membership already exists / Ya existe una membresía activa")
    @PostMapping("/renew")
    @PreAuthorize("hasAuthority('CLIENT')")
    public ResponseEntity<MembershipResponseDto> renewMembership(Authentication authentication) {
        String email = authentication.getName();
        return ResponseEntity.ok(membershipService.renewMembership(email));
    }

    @Operation(summary = "Search memberships / Buscar membresías")
    @ApiResponse(responseCode = "200", description = "List of memberships retrieved successfully / Lista de membresías obtenida exitosamente")
    @GetMapping("/search")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Page<MembershipResponseDto>> searchMemberships(
            @Parameter(description = "Start date (yyyy-MM-dd) / Fecha de inicio") @RequestParam(required = false) LocalDate startDate,
            @Parameter(description = "End date (yyyy-MM-dd) / Fecha de fin") @RequestParam(required = false) LocalDate endDate,
            @Parameter(description = "Status / Estado") @RequestParam(required = false) String status,
            @Parameter(description = "Page number / Número de página") @RequestParam(defaultValue = "0") int page,
            @Parameter(description = "Quantity results by page / Cantidad de resultados por página") @RequestParam(defaultValue = "10") int size,
            @Parameter(description = "Sort parameter / Parámetro de ordenamiento") @RequestParam(defaultValue = "paymentDate", required = false) String sortBy,
            @Parameter(description = "(ASC/DESC) / Orden de los resultados") @RequestParam(defaultValue = "DESC", required = false) Sort.Direction direction
    ) {
        return ResponseEntity.ok(membershipService.filterMemberships(startDate, endDate, status, page, size, sortBy, direction));
    }

    @Operation(summary = "Cancel membership / Cancelar membresía")
    @ApiResponse(responseCode = "200", description = "Membership cancelled successfully / Membresía cancelada exitosamente")
    @ApiResponse(responseCode = "404", description = "Membership not found / Membresía no encontrada")
    @PutMapping("/cancel/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<MembershipResponseDto> cancelMembership(
            @Parameter(description = "Membership ID / ID de la membresía") @PathVariable Long id
    ) {
        return ResponseEntity.ok(membershipService.cancelMembership(id));
    }
}

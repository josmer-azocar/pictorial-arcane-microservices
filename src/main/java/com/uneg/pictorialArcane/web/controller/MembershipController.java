package com.uneg.pictorialArcane.web.controller;

import com.uneg.pictorialArcane.domain.dto.response.MembershipResponseDto;
import com.uneg.pictorialArcane.domain.service.MembershipService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

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
}

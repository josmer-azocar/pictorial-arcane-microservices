package com.uneg.pictorialArcane.web.controller;


import com.uneg.pictorialArcane.domain.dto.response.PurchaseResponseDto;
import com.uneg.pictorialArcane.domain.service.SaleService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.springframework.data.domain.Page;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/sale")
@Tag(name = "Sale", description = "Sale management functions / Funciones de gestión de ventas")
public class SaleController {

    private final SaleService saleService;

    public SaleController(SaleService saleService) {
        this.saleService = saleService;
    }

    @PreAuthorize("hasRole('CLIENT')")
    @PostMapping("/reserve")
    @Operation(
            summary = "Reserve an Art Work / Reservar una obra de arte",
            description = "Allows an authenticated client to reserve an art work by providing the artwork ID and their security code. / Permite a un cliente autenticado reservar una obra de arte proporcionando el ID de la obra y su código de seguridad.",
            responses = {
                    @ApiResponse(responseCode = "200", description = "Reservation created successfully / Reserva creada exitosamente"),
                    @ApiResponse(responseCode = "400", description = "Invalid security code or invalid parameters / Código de seguridad o parámetros inválidos"),
                    @ApiResponse(responseCode = "401", description = "Unauthorized / No autorizado"),
                    @ApiResponse(responseCode = "404", description = "User or Art Work not found / Usuario u obra de arte no encontrada"),
                    @ApiResponse(responseCode = "409", description = "Art Work not available for reservation / Obra de arte no disponible para reserva")
            }
    )
    public ResponseEntity<Void> reserveArtWork(
            @Parameter(description = "Art Work ID / ID de la obra de arte", example = "1")
            @RequestParam("id_obra") Long artworkId,
            @Parameter(description = "Client security code / Código de seguridad del cliente", example = "1234")
            @RequestParam("security_code") String securityCode,
            Authentication authentication) {
        String email = authentication.getName();
        saleService.reserveArtWork(artworkId, securityCode, email);
        return ResponseEntity.ok().build();
    }

    @PreAuthorize("hasRole('CLIENT')")
    @GetMapping("/MyPurchases")
    @Operation(
            summary = "Get client purchases / Obtener compras del cliente",
            description = "Returns a paginated list of purchases for the authenticated client. / Retorna una lista paginada de compras del cliente autenticado.",
            responses = {
                    @ApiResponse(responseCode = "200", description = "Purchases retrieved successfully / Compras obtenidas exitosamente"),
                    @ApiResponse(responseCode = "401", description = "Unauthorized / No autorizado"),
                    @ApiResponse(responseCode = "403", description = "Forbidden / Prohibido"),
                    @ApiResponse(responseCode = "404", description = "Client not found / Cliente no encontrado")
            }
    )
    public ResponseEntity<Page<PurchaseResponseDto>> getClientPurchases(
            @Parameter(description = "Page index (0-based) / Indice de pagina (base 0)")
            @RequestParam(defaultValue = "0") int page,
            @Parameter(description = "Page size / Tamano de pagina")
            @RequestParam(defaultValue = "10") int size,
            Authentication authentication){

        String clientEmail = authentication.getName();
        return ResponseEntity.ok(this.saleService.getClientPurchases(page, size, clientEmail));
    }
}

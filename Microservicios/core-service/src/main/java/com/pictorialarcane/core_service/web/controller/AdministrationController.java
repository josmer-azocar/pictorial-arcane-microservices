package com.pictorialarcane.core_service.web.controller;

import com.pictorialarcane.core_service.domain.Enum.ShippingStatus;
import com.pictorialarcane.core_service.domain.dto.request.PaymentRequestDto;
import com.pictorialarcane.core_service.domain.dto.response.BillingSummaryResponseDto;
import com.pictorialarcane.core_service.domain.dto.response.SaleResponseDto;
import com.pictorialarcane.core_service.domain.dto.response.UserProfileResponseDto;
import com.pictorialarcane.core_service.domain.service.AdministrationService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import jakarta.validation.constraints.NotNull;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
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
                    @ApiResponse(responseCode = "204", description = "No pending sales / No hay ventas pendientes"),
                    @ApiResponse(responseCode = "401", description = "Unauthorized / No autorizado"),
                    @ApiResponse(responseCode = "403", description = "Forbidden, ADMIN role required / Prohibido, se requiere rol ADMIN")
            }
    )
    ResponseEntity<List<SaleResponseDto>> getAllPendingSales(){
        if(this.administrationService.getAllPendingSales().isEmpty()){
            return ResponseEntity.noContent().build();
        }
        return ResponseEntity.ok(this.administrationService.getAllPendingSales());
    }

    @PutMapping("/confirmSale/{saleId}")
    @Operation(
            summary = "Confirm a sale / Confirmar una venta",
            description = "Requires ADMIN role. Confirms a pending sale with payment information, description and shipping address. / Requiere rol ADMIN. Confirma una venta pendiente con informacion de pago, descripcion y direccion de envio.",
            responses = {
                    @ApiResponse(responseCode = "200", description = "Sale confirmed successfully / Venta confirmada exitosamente"),
                    @ApiResponse(responseCode = "400", description = "Invalid payment data or request body / Datos de pago o cuerpo de solicitud invalidos"),
                    @ApiResponse(responseCode = "401", description = "Unauthorized / No autorizado"),
                    @ApiResponse(responseCode = "403", description = "Forbidden, ADMIN role required / Prohibido, se requiere rol ADMIN"),
                    @ApiResponse(responseCode = "404", description = "Sale not found or not pending / Venta no encontrada o no pendiente"),
                    @ApiResponse(responseCode = "500", description = "Server error / Error del servidor")
            }
    )
    ResponseEntity<SaleResponseDto> confirmSale(@Parameter(description = "Sale ID / ID de la venta") @PathVariable Long saleId,
                                                Authentication authentication,
                                                @Parameter(description = "Payment data / Datos del pago")
                                                @RequestBody @Valid PaymentRequestDto paymentRequestDto,
                                                @Parameter(description = "Sale Description / Descripcion de la venta") @RequestParam String description,
                                                @Parameter(description = "Direction / Direccion de envio") @RequestParam String direction){
        return ResponseEntity.ok(this.administrationService.confirmSale(saleId, authentication.getName(), paymentRequestDto, description, direction));
    }

    @PutMapping("/updateShippingStatus/{saleId}")
    @Operation(
            summary = "Update shipping status / Actualizar estado de envio",
            description = "Requires ADMIN role. Updates the shipping status of a sale by id. / Requiere rol ADMIN. Actualiza el estado de envio de una venta por su id.",
            responses = {
                    @ApiResponse(responseCode = "200", description = "Shipping status updated successfully / Estado de envio actualizado exitosamente"),
                    @ApiResponse(responseCode = "400", description = "Invalid shipping status / Estado de envio invalido"),
                    @ApiResponse(responseCode = "401", description = "Unauthorized / No autorizado"),
                    @ApiResponse(responseCode = "403", description = "Forbidden, ADMIN role required / Prohibido, se requiere rol ADMIN"),
                    @ApiResponse(responseCode = "404", description = "Sale not found / Venta no encontrada"),
                    @ApiResponse(responseCode = "500", description = "Server error / Error del servidor")
            }
    )
    ResponseEntity<SaleResponseDto> updateShippingStatus(@Parameter(description = "Sale ID / ID de la venta") @PathVariable Long saleId,
                                                         @Parameter(description = "New shipping status / Nuevo estado de envio") @RequestParam @NotNull ShippingStatus shippingStatus){
        return ResponseEntity.ok(this.administrationService.updateShippingStatus(saleId, shippingStatus));
    }

    @PutMapping("/rejectPendingSale/{saleId}")
    @Operation(
            summary = "Reject a pending sale / Rechazar una venta pendiente",
            description = "Requires ADMIN role. Rejects a pending sale by id using current user. / Requiere rol ADMIN. Rechaza una venta pendiente por id usando el usuario actual.",
            responses = {
                    @ApiResponse(responseCode = "200", description = "Pending sale rejected successfully / Venta pendiente rechazada exitosamente"),
                    @ApiResponse(responseCode = "401", description = "Unauthorized / No autorizado"),
                    @ApiResponse(responseCode = "403", description = "Forbidden, ADMIN role required / Prohibido, se requiere rol ADMIN"),
                    @ApiResponse(responseCode = "404", description = "Pending sale not found / Venta pendiente no encontrada")

            }
    )
    ResponseEntity<Void> rejectPendingSale(@Parameter(description = "Sale ID / ID de la venta") @PathVariable Long saleId,
                                           Authentication authentication){
        this.administrationService.rejectPendingSale(saleId, authentication.getName());
        return ResponseEntity.ok().build();
    }

    @GetMapping("/findClient/{dni}")
    @Operation(
            summary = "Get client profile by DNI / Obtener perfil de cliente por DNI",
            description = "Requires ADMIN role. Returns user + client information for the specific client identified by DNI. / Requiere rol ADMIN. Retorna información de usuario + cliente del cliente identificado por su DNI.",
            responses = {
                    @ApiResponse(responseCode = "200", description = "Client profile retrieved successfully / Perfil del cliente obtenido exitosamente"),
                    @ApiResponse(responseCode = "401", description = "Unauthorized / No autorizado"),
                    @ApiResponse(responseCode = "403", description = "Forbidden, ADMIN role required / Prohibido, se requiere rol ADMIN"),
                    @ApiResponse(responseCode = "404", description = "User / Client not found / Usuario / Cliente no encontrado")
            }
    )
    public ResponseEntity<UserProfileResponseDto> getClientProfileByDni(
            @Parameter(description = "Client DNI / DNI del cliente")
            @PathVariable("dni") Long dni
    ) {
        return ResponseEntity.ok(this.administrationService.getClientProfileByDni(dni));
    }

    @GetMapping("/billingSummary")
    @Operation(
            summary = "Billing summary by period / Resumen de facturación por periodo",
            description = "Requires ADMIN role. Returns total collected and list of approved sales in the given date range. / Requiere rol ADMIN. Retorna total recaudado y lista de ventas aprobadas en el rango de fechas.",
            responses = {
                    @ApiResponse(responseCode = "200", description = "Billing summary retrieved successfully / Resumen obtenido exitosamente"),
                    @ApiResponse(responseCode = "400", description = "Invalid date range / Rango de fechas inválido"),
                    @ApiResponse(responseCode = "401", description = "Unauthorized / No autorizado"),
                    @ApiResponse(responseCode = "403", description = "Forbidden, ADMIN role required / Prohibido, se requiere rol ADMIN")
            }
    )
    public ResponseEntity<BillingSummaryResponseDto> getBillingSummaryByPeriod(
            @Parameter(description = "Start date (YYYY-MM-DD) / Fecha inicial (YYYY-MM-DD)")
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate startDate,
            @Parameter(description = "End date (YYYY-MM-DD) / Fecha final (YYYY-MM-DD)")
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate endDate
    ) {
        return ResponseEntity.ok(this.administrationService.getBillingSummaryByPeriod(startDate, endDate));
    }

}

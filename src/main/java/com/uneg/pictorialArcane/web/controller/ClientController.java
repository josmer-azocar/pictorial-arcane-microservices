package com.uneg.pictorialArcane.web.controller;

import com.uneg.pictorialArcane.domain.dto.response.ClientResponseDto;
import com.uneg.pictorialArcane.domain.dto.update.UpdateClientDto;
import com.uneg.pictorialArcane.domain.service.ClientService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/client")
@Tag(name = "Client", description = "CRUD Client and additional information / CRUD Cliente e información adicional")
public class ClientController {

    private final ClientService clientService;

    public ClientController(ClientService clientService) {
        this.clientService = clientService;
    }

    @PutMapping("/update")
    @PreAuthorize("hasRole('CLIENT')")
    @Operation(
            summary = "Update Client Information / Actualizar información del cliente",
            description = "Requires CLIENT role. Updates the client's information based on the authenticated user. / Requiere rol CLIENT. Actualiza la información del cliente basado en el usuario autenticado.",
            responses = {
                    @ApiResponse(responseCode = "200", description = "Client updated successfully / Cliente actualizado exitosamente"),
                    @ApiResponse(responseCode = "400", description = "Invalid input data / Datos de entrada inválidos"),
                    @ApiResponse(responseCode = "404", description = "Client not found / Cliente no encontrado")
            }
    )
    public ResponseEntity<ClientResponseDto> updateClient(@Parameter(description = "Updated Client data / Datos actualizados del cliente",
                                                                     example = """
                                                                             {
                                                                                 "creditCardNumber": 1234567890123456,
                                                                                 "postalCode": 12345
                                                                             }""")
                                                          @Valid @RequestBody UpdateClientDto updateClientDto,
                                                          Authentication authentication){
        String email = authentication.getName();
        return ResponseEntity.ok(clientService.updateClient(updateClientDto, email));
    }

    @PostMapping("/createSecurityCode")
    @PreAuthorize("hasRole('CLIENT')")
    @Operation(
            summary = "Create Security Code / Crear código de seguridad",
            description = "Requires CLIENT role. Generates a new security code for the authenticated client. / Requiere rol CLIENT. Genera un nuevo código de seguridad para el cliente autenticado.",
            responses = {
                    @ApiResponse(responseCode = "200", description = "Security code created successfully / Código de seguridad creado exitosamente"),
                    @ApiResponse(responseCode = "404", description = "User / Client not found / Usuario / Cliente no encontrado")
            }
    )
    public ResponseEntity<Void> createSecurityCode(Authentication authentication){
        String email = authentication.getName();
        clientService.createSecurityCode(email);
        return ResponseEntity.ok().build();
    }

}

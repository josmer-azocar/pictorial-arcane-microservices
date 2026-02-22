package com.uneg.pictorialArcane.web.controller;

import com.uneg.pictorialArcane.domain.dto.response.ClientResponseDto;
import com.uneg.pictorialArcane.domain.dto.update.UpdateClientDto;
import com.uneg.pictorialArcane.domain.service.ClientService;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/client")
@Tag(name = "Client", description = "CRUD Client and additional information")
public class ClientController {

    private final ClientService clientService;

    public ClientController(ClientService clientService) {
        this.clientService = clientService;
    }

    @PutMapping("/update")
    @PreAuthorize("hasRole('CLIENT')")
    public ResponseEntity<ClientResponseDto> updateClient(@Valid @RequestBody UpdateClientDto updateClientDto,
                                                          Authentication authentication){
        String email = authentication.getName();
        return ResponseEntity.ok(clientService.updateClient(updateClientDto, email));
    }

    @PostMapping("/createSecurityCode")
    @PreAuthorize("hasRole('CLIENT')")
    public ResponseEntity<Void> createSecurityCode(Authentication authentication){
        String email = authentication.getName();
        clientService.createSecurityCode(email);
        return ResponseEntity.ok().build();
    }

}

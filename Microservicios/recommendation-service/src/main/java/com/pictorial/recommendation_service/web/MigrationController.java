package com.pictorial.recommendation_service.web;

import com.pictorial.recommendation_service.service.ArtworkMigrationService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/admin/catalog-migration")
public class MigrationController {

    @Autowired
    private ArtworkMigrationService migrationService;

    @PreAuthorize("permitAll()")
    @PostMapping("/run")
    public ResponseEntity<String> ejecutar() {
        // Al ser @Async, responde inmediatamente "OK" al cliente
        // mientras el bucle de migración sigue ejecutándose en segundo plano en el servidor.
        migrationService.migrarObrasAVectores();
        return ResponseEntity.ok("Proceso de migración iniciado en segundo plano. Revisa la consola/logs del servidor.");
    }
}
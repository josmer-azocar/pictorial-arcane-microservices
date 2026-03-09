package com.uneg.pictorialArcane.web.controller;

import com.uneg.pictorialArcane.domain.dto.response.UserResponseDto;
import com.uneg.pictorialArcane.domain.dto.update.UpdateUserDto;
import com.uneg.pictorialArcane.domain.service.UserService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/user")
@Tag(name = "User", description = "Additional user functions / Funciones adicionales de usuario")
public class UserController {

    private final UserService userService;

    public UserController(UserService userService) {
        this.userService = userService;
    }

    @PutMapping("/update")
    @PreAuthorize("isAuthenticated()")
    @Operation(
            summary = "Update User Information / Actualizar información del usuario",
            description = "Updates the authenticated user's information. / Actualiza la información del usuario autenticado.",
            responses = {
                    @ApiResponse(responseCode = "200", description = "User updated successfully / Usuario actualizado exitosamente"),
                    @ApiResponse(responseCode = "400", description = "Invalid input data / Datos de entrada inválidos"),
                    @ApiResponse(responseCode = "404", description = "User not found / Usuario no encontrado")
            }
    )
    public ResponseEntity<UserResponseDto> updateUser(
            @Parameter(description = "Updated User data / Datos actualizados del usuario")
            @Valid @RequestBody UpdateUserDto updateUserDto,
            Authentication authentication
    ) {
        String email = authentication.getName();
        return ResponseEntity.ok(userService.updateUser(email, updateUserDto));
    }
}

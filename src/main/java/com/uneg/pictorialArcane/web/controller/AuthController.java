package com.uneg.pictorialArcane.web.controller;

import com.uneg.pictorialArcane.domain.dto.request.LoginRequestDto;
import com.uneg.pictorialArcane.domain.dto.request.RegisterRequestDto;
import com.uneg.pictorialArcane.domain.dto.response.AuthResponseDto;
import com.uneg.pictorialArcane.domain.service.AuthService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/auth")
@Tag(name = "Auth", description = "Authentication functions / Funciones de autenticación")
public class AuthController {

    private final AuthService authService;

    public AuthController(AuthService authService) {
        this.authService = authService;
    }

    /**
     * Endpoint to log in a registered User.
     * Endpoint para iniciar sesión de un usuario registrado.
     */
    @PostMapping(value = "login")
    @Operation(
            summary = "Allow to log in a User by his email and password / Permite iniciar sesión a un usuario mediante su email y contraseña",
            description = "return LoginRequestDto (Record Object) / Retorna LoginRequestDto (Objeto Record)",
            responses = {
                    @ApiResponse(responseCode = "200", description = "User logged-in successfully / Usuario inició sesión exitosamente"),
                    @ApiResponse(responseCode = "400", description = "Invalid credentials or User not found / Credenciales inválidas o Usuario no encontrado")
            }
    )
    public ResponseEntity<AuthResponseDto> login(@Parameter(description = "Email and password / Email y contraseña",
                                                            example = """
                                                                    {
                                                                        "email" : "UserName@email.com",
                                                                        "password" : "a01234567"
                                                                    }""")
                                                     @RequestBody
                                                     @Valid LoginRequestDto requestDto){

        return ResponseEntity.ok(authService.login(requestDto));
    }

    /**
     * Endpoint to register a new User.
     * Endpoint para registrar un nuevo usuario.
     */
    @PostMapping(value = "register")
    @Operation(
            summary = "Allow to register a new User by an email, , dni, password, first name and last name. / Permite registrar un nuevo usuario mediante email, dni, contraseña, nombre y apellido.",
            description = "return RegisterRequestDto (Record Object) / Retorna RegisterRequestDto (Objeto Record)",
            responses = {
                    @ApiResponse(responseCode = "200", description = "new User registered successfully / Nuevo usuario registrado exitosamente"),
                    @ApiResponse(responseCode = "400", description = "User already exists or Invalid input data / Usuario ya existe o Datos de entrada inválidos")
            }
    )
    public ResponseEntity<AuthResponseDto> register( @Parameter(description = "Dni, Email, password, first name, and last name / DNI, Email, contraseña, nombre y apellido",
                                                                example = """
                                                                    {
                                                                        "Dni" : "12345678",
                                                                        "email" : "UserName@email.com",
                                                                        "password" : "a01234567"
                                                                        "firstName" : "FirstNameExample"
                                                                        "lastName" : "LastNameExample"
                                                                    }""")
                                                         @RequestBody
                                                         @Valid RegisterRequestDto requestDto){

        return ResponseEntity.ok(authService.register(requestDto));
    }
}

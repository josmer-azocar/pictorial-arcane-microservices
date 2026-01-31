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
@Tag(name = "Auth", description = "Authentication functions")
public class AuthController {

    private final AuthService authService;

    public AuthController(AuthService authService) {
        this.authService = authService;
    }

    /**
     * @description
     * Endpoint to log in a registered User.
     */
    @PostMapping(value = "login")
    @Operation(
            summary = "Allow to log in a User by his email and password",
            description = "return LoginRequestDto (Record Object)",
            responses = {
                    @ApiResponse(responseCode = "200", description = "User logged-in successfully"),
            }
    )
    public ResponseEntity<AuthResponseDto> login(@Parameter(description = "Email and password",
                                                            example = "{\n" +
                                                                    "    \"email\" : \"UserName@email.com\",\n" +
                                                                    "    \"password\" : \"a01234567\"\n" +
                                                                    "}")
                                                     @RequestBody
                                                     @Valid LoginRequestDto requestDto){

        return ResponseEntity.ok(authService.login(requestDto));
    }

    /**
     * @description
     * Endpoint to register a new User.
     */
    @PostMapping(value = "register")
    @Operation(
            summary = "Allow to register a new User by an email, , dni, password, first name and last name.",
            description = "return RegisterRequestDto (Record Object)",
            responses = {
                    @ApiResponse(responseCode = "200", description = "new User registered successfully"),
            }
    )
    public ResponseEntity<AuthResponseDto> register( @Parameter(description = "Dni, Email, password, first name, and last name",
                                                                example = "{\n" +
                                                                        "    \"Dni\" : \"12345678\",\n" +
                                                                    "    \"email\" : \"UserName@email.com\",\n" +
                                                                    "    \"password\" : \"a01234567\"\n" +
                                                                    "    \"firstName\" : \"FirstNameExample\"\n" +
                                                                    "    \"lastName\" : \"LastNameExample\"\n" +
                                                                    "}")
                                                         @RequestBody
                                                         @Valid RegisterRequestDto requestDto){

        return ResponseEntity.ok(authService.register(requestDto));
    }
}

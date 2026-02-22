package com.uneg.pictorialArcane.domain.service;

import com.uneg.pictorialArcane.domain.Enum.Role;
import com.uneg.pictorialArcane.domain.dto.request.LoginRequestDto;
import com.uneg.pictorialArcane.domain.dto.request.RegisterRequestDto;
import com.uneg.pictorialArcane.domain.dto.response.AuthResponseDto;
import com.uneg.pictorialArcane.domain.exception.UserAlreadyExistsException;
import com.uneg.pictorialArcane.domain.tools.SecurityCodeGenerator;
import com.uneg.pictorialArcane.jwt.JwtService;
import com.uneg.pictorialArcane.persistence.crud_repository.CrudClientRepository;
import com.uneg.pictorialArcane.persistence.crud_repository.CrudUserRepository;
import com.uneg.pictorialArcane.persistence.entity.ClientEntity;
import com.uneg.pictorialArcane.persistence.entity.UserEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.security.SecureRandom;

@Service // Define que esta clase es un servicio de la capa de negocio
public class AuthService {

    private final CrudUserRepository crudUserRepository; // Repositorio de usuarios
    private final CrudClientRepository crudClientRepository;
    private final JwtService jwtService; // Servicio para manejo de JWT
    private final PasswordEncoder passwordEncoder; // Encoder para contraseñas
    private final AuthenticationManager authenticationManager; // Manager de autenticación de Spring Security
    private final EmailService emailService;

    // Inyección de dependencias
    public AuthService(CrudUserRepository crudUserRepository, CrudClientRepository crudClientRepository, JwtService jwtService, PasswordEncoder passwordEncoder, AuthenticationManager authenticationManager, EmailService emailService) {
        this.crudUserRepository = crudUserRepository;
        this.crudClientRepository = crudClientRepository;
        this.jwtService = jwtService;
        this.passwordEncoder = passwordEncoder;
        this.authenticationManager = authenticationManager;
        this.emailService = emailService;
    }

    // Método para login
    public AuthResponseDto login(LoginRequestDto requestDto) {
        // Intenta autenticar al usuario usando UsernamePasswordAuthenticationToken
        authenticationManager.authenticate(new UsernamePasswordAuthenticationToken(requestDto.email(), requestDto.password()));

        // Si la autenticación es exitosa, busca al usuario en la BD
        UserDetails user = crudUserRepository.findByEmail(requestDto.email()).orElseThrow();

        // Genera el token JWT
        String token = jwtService.getToken(user);

        // Retorna la respuesta con el token
        return AuthResponseDto.builder()
                .token(token)
                .build();
    }

    // Método para registro
    public AuthResponseDto register(RegisterRequestDto requestDto) {

         // Verifica si el usuario ya existe (usando variable temporal)
         if (this.crudUserRepository.findFirstByEmail(requestDto.email()) != null) {
            throw new UserAlreadyExistsException(requestDto.email()); // Lanza excepción si ya existe
        }

        // Construye la entidad del nuevo usuario con la contraseña codificada
        UserEntity user = UserEntity.builder()
                .dniUser(requestDto.dniUser())
                .email(requestDto.email())
                .password(passwordEncoder.encode(requestDto.password())) // Hashea la contraseña
                .firstName(requestDto.firstName())
                .lastName(requestDto.lastName())
                .role(requestDto.role().toString())
                .build();

        // Guarda el usuario en la base de datos
        crudUserRepository.save(user);

        // Verifica si el Usuario es Cliente para crear un registro Client en la Base de Datos
        if (user.getRole().equals("CLIENT")) {

            ClientEntity client = ClientEntity.builder()
                            .user(user)
                    .build();

            crudClientRepository.save(client);
        }

        // Retorna el token generado para el nuevo usuario
        return AuthResponseDto.builder().token(jwtService.getToken(user)).build();
    }


}

package com.pictorialarcane.core_service.domain.service;

import com.pictorialarcane.core_service.client.AuditClient;
import com.pictorialarcane.core_service.client.RecommendationClient;
import com.pictorialarcane.core_service.client.dto.ClientSyncRequest;
import com.pictorialarcane.core_service.client.dto.SecurityLogRequest;
import com.pictorialarcane.core_service.domain.Enum.Role;
import com.pictorialarcane.core_service.domain.dto.request.LoginRequestDto;
import com.pictorialarcane.core_service.domain.dto.request.RegisterRequestDto;
import com.pictorialarcane.core_service.domain.dto.response.AuthResponseDto;
import com.pictorialarcane.core_service.domain.exception.UserAlreadyExistsException;
import com.pictorialarcane.core_service.domain.tools.SecurityCodeGenerator;
import com.pictorialarcane.core_service.jwt.JwtService;
import com.pictorialarcane.core_service.persistence.crud_repository.CrudClientRepository;
import com.pictorialarcane.core_service.persistence.crud_repository.CrudUserRepository;
import com.pictorialarcane.core_service.persistence.entity.ClientEntity;
import com.pictorialarcane.core_service.persistence.entity.UserEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.AuthenticationException;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

@Service // Define que esta clase es un servicio de la capa de negocio
public class AuthService {

    private final CrudUserRepository crudUserRepository; // Repositorio de usuarios
    private final CrudClientRepository crudClientRepository;
    private final JwtService jwtService; // Servicio para manejo de JWT
    private final PasswordEncoder passwordEncoder; // Encoder para contraseñas
    private final AuthenticationManager authenticationManager; // Manager de autenticación de Spring Security
    private final EmailService emailService;
    private final AuditClient auditClient;
    private final RecommendationClient recommendationClient;

    // Inyección de dependencias
    public AuthService(CrudUserRepository crudUserRepository, CrudClientRepository crudClientRepository, JwtService jwtService, PasswordEncoder passwordEncoder, AuthenticationManager authenticationManager, EmailService emailService, AuditClient auditClient, RecommendationClient recommendationClient) {
        this.crudUserRepository = crudUserRepository;
        this.crudClientRepository = crudClientRepository;
        this.jwtService = jwtService;
        this.passwordEncoder = passwordEncoder;
        this.authenticationManager = authenticationManager;
        this.emailService = emailService;
        this.auditClient = auditClient;
        this.recommendationClient = recommendationClient;
    }

    // Método para login
    public AuthResponseDto login(LoginRequestDto requestDto) {
        // Intenta autenticar al usuario usando UsernamePasswordAuthenticationToken
        try {
            authenticationManager.authenticate(new UsernamePasswordAuthenticationToken(requestDto.email(), requestDto.password()));
        } catch (AuthenticationException ex) {
            // Auditoría: registrar el intento de inicio de sesión fallido (security_log_by_event).
            auditClient.registerSecurityLog(new SecurityLogRequest(
                    "LOGIN_FAILURE",
                    null,
                    null,
                    "Intento de inicio de sesión fallido para " + requestDto.email(),
                    null,
                    null
            ));
            throw ex;
        }

        // Si la autenticación es exitosa, busca al usuario en la BD
        UserEntity user = crudUserRepository.findByEmail(requestDto.email()).orElseThrow();

        // Genera el token JWT
        String token = jwtService.getToken(user);

        // Auditoría: registrar el inicio de sesión exitoso en el audit-service (security_log_by_event).
        boolean isAdmin = Role.ADMIN.name().equals(user.getRole());
        auditClient.registerSecurityLog(new SecurityLogRequest(
                "LOGIN_SUCCESS",
                isAdmin ? user.getDniUser() : null,
                isAdmin ? null : user.getDniUser(),
                "Inicio de sesión exitoso para " + user.getEmail(),
                null,
                null
        ));

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

            // Crea el nodo (:Comprador) en el grafo de recomendaciones, identificado por dniUser.
            // Es el punto de alta del comprador; compra y vista luego lo referencian por ese id.
            recommendationClient.syncClient(new ClientSyncRequest(
                    String.valueOf(user.getDniUser()),
                    user.getFirstName() + " " + user.getLastName(),
                    user.getEmail()
            ));
        }

        // Auditoría: registrar el alta de la nueva cuenta (security_log_by_event).
        boolean isAdmin = Role.ADMIN.name().equals(user.getRole());
        auditClient.registerSecurityLog(new SecurityLogRequest(
                "USER_REGISTERED",
                isAdmin ? user.getDniUser() : null,
                isAdmin ? null : user.getDniUser(),
                "Registro de nueva cuenta " + user.getEmail() + " con rol " + user.getRole(),
                null,
                null
        ));

        // Retorna el token generado para el nuevo usuario
        return AuthResponseDto.builder().token(jwtService.getToken(user)).build();
    }


}

package com.pictorialarcane.core_service.domain.service;

import com.pictorialarcane.core_service.domain.dto.response.ClientResponseDto;
import com.pictorialarcane.core_service.domain.dto.update.UpdateClientDto;
import com.pictorialarcane.core_service.domain.exception.UserDoesNotExistsException;
import com.pictorialarcane.core_service.domain.tools.SecurityCodeGenerator;
import com.pictorialarcane.core_service.persistence.impl_repository.ClientRepository;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

@Service
public class ClientService {

    private final ClientRepository clientRepository;
    private final PasswordEncoder passwordEncoder;
    private final EmailService emailService;

    public ClientService(ClientRepository clientRepository, PasswordEncoder passwordEncoder, EmailService emailService) {
        this.clientRepository = clientRepository;
        this.passwordEncoder = passwordEncoder;
        this.emailService = emailService;
    }

    public ClientResponseDto updateClient(UpdateClientDto updateClientDto, String email) {
        return clientRepository.updateClient(updateClientDto, email);
    }

    public void createSecurityCode(String email) {
        if (clientRepository.getClientByEmail(email) == null) throw new UserDoesNotExistsException(email);

        String code = SecurityCodeGenerator.generateNumericPin(6);
        ClientResponseDto clientResponseDto = clientRepository.getClientByEmail(email);

        clientRepository.assignClientCode(clientResponseDto, passwordEncoder.encode(code));
        emailService.sendSimpleEmail(email, "CODIGO DE SEGURIDAD DE PICTORIAL ARCANE", "Tu Codigo de Seguridad es el Siguiente: " + code);
    }
}

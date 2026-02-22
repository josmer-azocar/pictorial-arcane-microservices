package com.uneg.pictorialArcane.domain.service;

import com.uneg.pictorialArcane.domain.dto.response.ClientResponseDto;
import com.uneg.pictorialArcane.domain.dto.update.UpdateClientDto;
import com.uneg.pictorialArcane.domain.exception.UserDoesNotExistsException;
import com.uneg.pictorialArcane.domain.tools.SecurityCodeGenerator;
import com.uneg.pictorialArcane.persistence.impl_repository.ClientRepository;
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

package com.uneg.pictorialArcane.domain.service;

import com.uneg.pictorialArcane.domain.dto.response.ClientResponseDto;
import com.uneg.pictorialArcane.domain.dto.update.UpdateClientDto;
import com.uneg.pictorialArcane.persistence.impl_repository.ClientRepository;
import org.springframework.stereotype.Service;

@Service
public class ClientService {

    private final ClientRepository clientRepository;

    public ClientService(ClientRepository clientRepository) {
        this.clientRepository = clientRepository;
    }

    public ClientResponseDto updateClient(UpdateClientDto updateClientDto, String username) {
        return clientRepository.updateClient(updateClientDto, username);
    }
}

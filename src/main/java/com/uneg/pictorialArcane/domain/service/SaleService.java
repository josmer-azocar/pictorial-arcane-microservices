package com.uneg.pictorialArcane.domain.service;

import com.uneg.pictorialArcane.domain.exception.ArtWorkNotAvailableException;
import com.uneg.pictorialArcane.domain.exception.InvalidSecurityCodeException;
import com.uneg.pictorialArcane.domain.exception.UserDoesNotExistsException;
import com.uneg.pictorialArcane.persistence.crud_repository.CrudClientRepository;
import com.uneg.pictorialArcane.persistence.crud_repository.CrudUserRepository;
import com.uneg.pictorialArcane.persistence.entity.ArtWorkEntity;
import com.uneg.pictorialArcane.persistence.entity.ClientEntity;
import com.uneg.pictorialArcane.persistence.entity.UserEntity;
import com.uneg.pictorialArcane.persistence.impl_repository.ArtWorkRespository;
import com.uneg.pictorialArcane.persistence.impl_repository.SaleRepository;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

@Service
public class SaleService {

    private final ArtWorkRespository artWorkRespository;
    private final CrudUserRepository crudUserRepository;
    private final CrudClientRepository crudClientRepository;
    private final SaleRepository saleRepository;
    private final PasswordEncoder passwordEncoder;

    public SaleService(ArtWorkRespository artWorkRespository,
                       CrudUserRepository crudUserRepository,
                       CrudClientRepository crudClientRepository,
                       SaleRepository saleRepository,
                       PasswordEncoder passwordEncoder) {
        this.artWorkRespository = artWorkRespository;
        this.crudUserRepository = crudUserRepository;
        this.crudClientRepository = crudClientRepository;
        this.saleRepository = saleRepository;
        this.passwordEncoder = passwordEncoder;
    }

    public void reserveArtWork(Long artworkId, String securityCode, String email) {
        UserEntity user = crudUserRepository.findFirstByEmail(email);
        if (user == null) {
            throw new UserDoesNotExistsException(email);
        }

        ClientEntity client = crudClientRepository.findFirstByDniUser(user.getDniUser());

        if (client == null) {
            throw new UserDoesNotExistsException(email);
        }

        if (!passwordEncoder.matches(securityCode, client.getSecurityCode())) {
            throw new InvalidSecurityCodeException();
        }

        ArtWorkEntity artWork = artWorkRespository.getArtWorkEntityById(artworkId);

        if (!"AVAILABLE".equalsIgnoreCase(artWork.getStatus())) {
            throw new ArtWorkNotAvailableException(artworkId);
        }

        saleRepository.createReservedSale(artWork, client);

        artWork.setStatus("RESERVED");
        artWorkRespository.saveEntity(artWork);
    }
}

package com.pictorialarcane.core_service.domain.service;

import com.pictorialarcane.core_service.client.ArtworkClient;
import com.pictorialarcane.core_service.client.AuditClient;
import com.pictorialarcane.core_service.client.RecommendationClient;
import com.pictorialarcane.core_service.client.dto.SecurityLogRequest;
import com.pictorialarcane.core_service.client.dto.ViewSyncRequest;
import com.pictorialarcane.core_service.domain.dto.response.PurchaseResponseDto;
import com.pictorialarcane.core_service.domain.exception.InvalidSecurityCodeException;
import com.pictorialarcane.core_service.domain.exception.UserDoesNotExistsException;
import com.pictorialarcane.core_service.persistence.crud_repository.CrudClientRepository;
import com.pictorialarcane.core_service.persistence.crud_repository.CrudUserRepository;
import com.pictorialarcane.core_service.persistence.entity.ClientEntity;
import com.pictorialarcane.core_service.persistence.entity.UserEntity;
import com.pictorialarcane.core_service.persistence.impl_repository.SaleRepository;
import org.springframework.data.domain.Page;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;

@Service
public class SaleService {

    private final CrudUserRepository crudUserRepository;
    private final CrudClientRepository crudClientRepository;
    private final SaleRepository saleRepository;
    private final PasswordEncoder passwordEncoder;
    private final MembershipService membershipService;
    private final ArtworkClient artworkClient;
    private final AuditClient auditClient;
    private final RecommendationClient recommendationClient;

    public SaleService(CrudUserRepository crudUserRepository,
                       CrudClientRepository crudClientRepository,
                       SaleRepository saleRepository,
                       PasswordEncoder passwordEncoder,
                       MembershipService membershipService,
                       ArtworkClient artworkClient,
                       AuditClient auditClient,
                       RecommendationClient recommendationClient) {
        this.crudUserRepository = crudUserRepository;
        this.crudClientRepository = crudClientRepository;
        this.saleRepository = saleRepository;
        this.passwordEncoder = passwordEncoder;
        this.membershipService = membershipService;
        this.artworkClient = artworkClient;
        this.auditClient = auditClient;
        this.recommendationClient = recommendationClient;
    }

    public void reserveArtWork(Long artworkId, Double price, Double commissionRate, String securityCode, String email) {
        UserEntity user = crudUserRepository.findFirstByEmail(email);
        if (user == null) {
            throw new UserDoesNotExistsException(email);
        }

        ClientEntity client = crudClientRepository.findFirstByDniUser(user.getDniUser());

        if (client == null) {
            throw new UserDoesNotExistsException(email);
        }

        //validación de membresia
        membershipService.getActiveMembership(email);

        if (!passwordEncoder.matches(securityCode, client.getSecurityCode())) {
            // Auditoría: registrar el intento de compra con código de seguridad inválido.
            auditClient.registerSecurityLog(new SecurityLogRequest(
                    "INVALID_SECURITY_CODE",
                    null,
                    client.getDniUser(),
                    "Código de seguridad inválido al intentar comprar la obra " + artworkId + " (" + email + ")",
                    null,
                    null
            ));
            throw new InvalidSecurityCodeException();
        }

        // Reserva la obra en artwork-service (AVAILABLE -> RESERVED). Si no está disponible o el
        // servicio no responde, lanza ArtworkNotAvailableException y la venta NO se crea.
        artworkClient.reserve(artworkId, client.getDniUser());

        // Una vez asegurada la reserva de la obra, se registra la venta en estado PENDING.
        saleRepository.createReservedSale(artworkId, price, commissionRate, client);
    }

    public Page<PurchaseResponseDto> getClientPurchases(int page, int size, String clientEmail) {
        UserEntity user = crudUserRepository.findFirstByEmail(clientEmail);
        if (user == null) {
            throw new UserDoesNotExistsException(clientEmail);
        }

        ClientEntity client = crudClientRepository.findFirstByDniUser(user.getDniUser());
        if (client == null) {
            throw new UserDoesNotExistsException(clientEmail);
        }

        return this.saleRepository.getClientPurchases(page, size, user.getDniUser());
    }

    /**
     * Registra que el cliente autenticado vio una obra, sincronizando la relación
     * (Comprador)-[:SAW]->(Artwork) en el grafo de recomendaciones. Best-effort.
     */
    public void registerView(Long artworkId, String email) {
        UserEntity user = crudUserRepository.findFirstByEmail(email);
        if (user == null) {
            throw new UserDoesNotExistsException(email);
        }

        ClientEntity client = crudClientRepository.findFirstByDniUser(user.getDniUser());
        if (client == null) {
            throw new UserDoesNotExistsException(email);
        }

        recommendationClient.syncView(new ViewSyncRequest(
                String.valueOf(client.getDniUser()),
                artworkId,
                LocalDateTime.now().toString()
        ));
    }
}

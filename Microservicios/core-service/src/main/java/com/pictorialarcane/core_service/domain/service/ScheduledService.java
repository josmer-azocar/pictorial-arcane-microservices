package com.pictorialarcane.core_service.domain.service;

import com.pictorialarcane.core_service.domain.Enum.SaleStatus;
import com.pictorialarcane.core_service.domain.Enum.ShippingStatus;
import com.pictorialarcane.core_service.domain.dto.response.SaleResponseDto;
import com.pictorialarcane.core_service.persistence.crud_repository.CrudSaleRepositoy;
import com.pictorialarcane.core_service.persistence.entity.SaleEntity;
import com.pictorialarcane.core_service.persistence.impl_repository.MembershipRepository;
import com.pictorialarcane.core_service.persistence.impl_repository.SaleRepository;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.util.List;

@Service
public class ScheduledService {

    private final SaleRepository saleRepository;
    private final CrudSaleRepositoy crudSaleRepositoy;
    private final MembershipRepository membershipRepository;

    public ScheduledService(SaleRepository saleRepository,
                            CrudSaleRepositoy crudSaleRepositoy,
                            MembershipRepository membershipRepository) {
        this.saleRepository = saleRepository;
        this.crudSaleRepositoy = crudSaleRepositoy;
        this.membershipRepository = membershipRepository;
    }

    @Scheduled(cron = "0 0 * * * *")
    @Transactional
    public void cancelExpiredReservations() {
        System.out.println("Ejecutando limpieza automática de reservas...");

        List<SaleResponseDto> salesIn24h;
        salesIn24h = this.saleRepository.getAllPendingSalesAfter24h();

        if (salesIn24h.isEmpty()) {
            System.out.println("No se han encontrado reservas que han excedido el limite de 24h");
            return;
        }

        for (SaleResponseDto saleResponseDto : salesIn24h) {
            if (saleResponseDto != null) {
                SaleEntity sale = this.crudSaleRepositoy.findByIdSale(saleResponseDto.idSale());
                sale.setSaleStatus(SaleStatus.CANCELED.name());
                sale.setShippingStatus(ShippingStatus.CANCELED.name());
                this.crudSaleRepositoy.save(sale);

                // TODO: notificar al artwork-service (MongoDB) que la obra idArtwork vuelve a estar disponible.
                System.out.println("Reserva cancelada automáticamente para la venta ID: " + sale.getIdSale());
            }
        }

    }

    @Scheduled(cron = "0 0 0 * * *")
    @Transactional
    public void expireMemberships() {
        System.out.println("Ejecutando expiración automática de membresías...");

        int updated = this.membershipRepository.expireMemberships(LocalDate.now());

        if (updated <= 0) {
            System.out.println("No se han encontrado membresías para expirar");
            return;
        }

        System.out.println("Membresías expiradas automáticamente: " + updated);
    }
}

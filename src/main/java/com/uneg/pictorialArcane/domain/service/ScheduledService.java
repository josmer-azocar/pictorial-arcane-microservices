package com.uneg.pictorialArcane.domain.service;

import com.uneg.pictorialArcane.domain.Enum.ArtWorkStatus;
import com.uneg.pictorialArcane.domain.Enum.SaleStatus;
import com.uneg.pictorialArcane.domain.Enum.ShippingStatus;
import com.uneg.pictorialArcane.domain.dto.response.SaleResponseDto;
import com.uneg.pictorialArcane.persistence.crud_repository.CrudArtWorkRepository;
import com.uneg.pictorialArcane.persistence.crud_repository.CrudSaleRepositoy;
import com.uneg.pictorialArcane.persistence.entity.ArtWorkEntity;
import com.uneg.pictorialArcane.persistence.entity.SaleEntity;
import com.uneg.pictorialArcane.persistence.impl_repository.MembershipRepository;
import com.uneg.pictorialArcane.persistence.impl_repository.SaleRepository;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.util.List;

@Service
public class ScheduledService {

    private final SaleRepository saleRepository;
    private final CrudSaleRepositoy crudSaleRepositoy;
    private final CrudArtWorkRepository crudArtWorkRepository;
    private final MembershipRepository membershipRepository;

    public ScheduledService(SaleRepository saleRepository,
                            CrudSaleRepositoy crudSaleRepositoy,
                            CrudArtWorkRepository crudArtWorkRepository,
                            MembershipRepository membershipRepository) {
        this.saleRepository = saleRepository;
        this.crudSaleRepositoy = crudSaleRepositoy;
        this.crudArtWorkRepository = crudArtWorkRepository;
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
                ArtWorkEntity artWork = sale.getArtWork();
                artWork.setStatus(ArtWorkStatus.AVAILABLE.name());

                this.crudArtWorkRepository.save(artWork);
                this.crudSaleRepositoy.save(sale);

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

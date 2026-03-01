package com.uneg.pictorialArcane.persistence.impl_repository;

import com.uneg.pictorialArcane.domain.Enum.SaleStatus;
import com.uneg.pictorialArcane.domain.Enum.ShippingStatus;
import com.uneg.pictorialArcane.persistence.crud_repository.CrudSaleRepositoy;
import com.uneg.pictorialArcane.persistence.entity.ArtWorkEntity;
import com.uneg.pictorialArcane.persistence.entity.ClientEntity;
import com.uneg.pictorialArcane.persistence.entity.SaleEntity;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;

@Repository
public class SaleRepository {

    private final CrudSaleRepositoy crudSaleRepositoy;
    private final Double TAX_AMOUNT = 0.16;

    public SaleRepository(CrudSaleRepositoy crudSaleRepositoy) {
        this.crudSaleRepositoy = crudSaleRepositoy;
    }

    public SaleEntity createReservedSale(ArtWorkEntity artWork, ClientEntity client) {
        SaleEntity sale = new SaleEntity();
        sale.setArtWork(artWork);
        sale.setClient(client);
        sale.setAdmin(null);
        sale.setDate(null);
        sale.setDescription(null);
        sale.setPrice(artWork.getPrice());

        Double commissionRate = artWork.getArtist().getCommissionRate();

        sale.setProfitPercentage(commissionRate);
        sale.setProfitAmount(commissionRate * sale.getPrice());
        sale.setTaxAmount(sale.getPrice() * TAX_AMOUNT);
        sale.setTotalPaid(sale.getPrice() + sale.getTaxAmount());
        sale.setShippingAddress(null);
        sale.setShippingStatus(null);
        sale.setSaleStatus(SaleStatus.PENDING.name());

        return crudSaleRepositoy.save(sale);
    }
}


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

    public SaleRepository(CrudSaleRepositoy crudSaleRepositoy) {
        this.crudSaleRepositoy = crudSaleRepositoy;
    }

    public SaleEntity createReservedSale(ArtWorkEntity artWork, ClientEntity client) {
        SaleEntity sale = new SaleEntity();
        sale.setArtWork(artWork);
        sale.setClient(client);
        sale.setAdmin(null);
        sale.setDate(LocalDate.now());
        sale.setDescription(null);
        sale.setPrice(artWork.getPrice());
        sale.setProfitPercentage(null);
        sale.setProfitAmount(null);
        sale.setTaxAmount(null);
        sale.setTotalPaid(null);
        sale.setShippingAddress(null);
        sale.setShippingStatus(null);
        sale.setSaleStatus(SaleStatus.PENDING.name());

        return crudSaleRepositoy.save(sale);
    }
}


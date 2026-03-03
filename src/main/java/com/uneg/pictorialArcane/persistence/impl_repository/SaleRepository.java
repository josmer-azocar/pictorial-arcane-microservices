package com.uneg.pictorialArcane.persistence.impl_repository;

import com.uneg.pictorialArcane.domain.Enum.ArtWorkStatus;
import com.uneg.pictorialArcane.domain.Enum.SaleStatus;
import com.uneg.pictorialArcane.domain.Enum.ShippingStatus;
import com.uneg.pictorialArcane.domain.dto.response.SaleResponseDto;
import com.uneg.pictorialArcane.persistence.crud_repository.CrudArtWorkRepository;
import com.uneg.pictorialArcane.persistence.crud_repository.CrudSaleRepositoy;
import com.uneg.pictorialArcane.persistence.crud_repository.CrudUserRepository;
import com.uneg.pictorialArcane.persistence.entity.ArtWorkEntity;
import com.uneg.pictorialArcane.persistence.entity.ClientEntity;
import com.uneg.pictorialArcane.persistence.entity.SaleEntity;
import com.uneg.pictorialArcane.persistence.mapper.SaleMapper;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;

@Repository
public class SaleRepository {

    private final CrudSaleRepositoy crudSaleRepository;
    private final CrudUserRepository crudUserRepository;
    private final SaleMapper saleMapper;
    private final Double TAX_AMOUNT = 0.16;
    private final CrudArtWorkRepository crudArtWorkRepository;

    public SaleRepository(CrudSaleRepositoy crudSaleRepository, CrudUserRepository crudUserRepository, SaleMapper saleMapper, CrudArtWorkRepository crudArtWorkRepository) {
        this.crudSaleRepository = crudSaleRepository;
        this.crudUserRepository = crudUserRepository;
        this.saleMapper = saleMapper;
        this.crudArtWorkRepository = crudArtWorkRepository;
    }

    public SaleResponseDto getSaleById(Long saleId){
        return this.saleMapper.toResponseDto(this.crudSaleRepository.findByIdSale(saleId));
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

        return crudSaleRepository.save(sale);
    }

    public List<SaleResponseDto> getAllPendingSalesAfter24h(){
        return this.saleMapper.toResponseDto(
                this.crudSaleRepository.findAllBySaleStatusContainsAndCreatedAtBeforeAndArtWork_Status(
                SaleStatus.PENDING.name(), LocalDateTime.now().minusHours(24), ArtWorkStatus.RESERVED.name()));

    }

    public void rejectPendingSale(Long saleId, Long adminId) {
        //update Sale DATA
        SaleEntity sale = this.crudSaleRepository.findByIdSale(saleId);
        sale.setAdmin(this.crudUserRepository.findByDniUser(adminId));
        sale.setSaleStatus(SaleStatus.CANCELED.name());
        sale.setShippingStatus(ShippingStatus.CANCELED.name());
        this.crudSaleRepository.save(sale);

        //update ArtWork DATA
        ArtWorkEntity artWork = sale.getArtWork();
        artWork.setStatus(ArtWorkStatus.AVAILABLE.name());
        this.crudArtWorkRepository.save(artWork);
    }
}


package com.uneg.pictorialArcane.persistence.impl_repository;

import com.uneg.pictorialArcane.domain.Enum.ArtWorkStatus;
import com.uneg.pictorialArcane.domain.Enum.SaleStatus;
import com.uneg.pictorialArcane.domain.Enum.ShippingStatus;
import com.uneg.pictorialArcane.domain.dto.request.PaymentRequestDto;
import com.uneg.pictorialArcane.domain.dto.response.BillingSaleItemResponseDto;
import com.uneg.pictorialArcane.domain.dto.response.BillingSummaryResponseDto;
import com.uneg.pictorialArcane.domain.dto.response.PurchaseResponseDto;
import com.uneg.pictorialArcane.domain.dto.response.SaleResponseDto;
import com.uneg.pictorialArcane.domain.exception.ArtWorkNotAvailableException;
import com.uneg.pictorialArcane.domain.exception.SaleException;
import com.uneg.pictorialArcane.persistence.crud_repository.CrudArtWorkRepository;
import com.uneg.pictorialArcane.persistence.crud_repository.CrudPaymentRepository;
import com.uneg.pictorialArcane.persistence.crud_repository.CrudSaleRepositoy;
import com.uneg.pictorialArcane.persistence.crud_repository.CrudUserRepository;
import com.uneg.pictorialArcane.persistence.entity.*;
import com.uneg.pictorialArcane.persistence.mapper.PaymentMapper;
import com.uneg.pictorialArcane.persistence.mapper.SaleMapper;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Repository
public class SaleRepository {

    private final CrudSaleRepositoy crudSaleRepository;
    private final CrudUserRepository crudUserRepository;
    private final SaleMapper saleMapper;
    private final Double TAX_AMOUNT = 0.16;
    private final CrudArtWorkRepository crudArtWorkRepository;
    private final PaymentMapper paymentMapper;
    private final CrudPaymentRepository crudPaymentRepository;


    public SaleRepository(CrudSaleRepositoy crudSaleRepository, CrudUserRepository crudUserRepository, SaleMapper saleMapper, CrudArtWorkRepository crudArtWorkRepository, PaymentMapper paymentMapper, CrudPaymentRepository crudPaymentRepository) {
        this.crudSaleRepository = crudSaleRepository;
        this.crudUserRepository = crudUserRepository;
        this.saleMapper = saleMapper;
        this.crudArtWorkRepository = crudArtWorkRepository;
        this.paymentMapper = paymentMapper;
        this.crudPaymentRepository = crudPaymentRepository;
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
        sale.setShippingStatus(ShippingStatus.PENDING.name());
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

    public Page<PurchaseResponseDto> getClientPurchases(int page, int size, Long dniUser) {
        return this.crudSaleRepository.getClientPurchases(dniUser, PageRequest.of(page, size))
                .map(sale -> new PurchaseResponseDto(
                        sale.getIdSale(),
                        Optional.ofNullable(sale.getArtWork()).map(ArtWorkEntity::getName).orElse(null),
                        sale.getDate(),
                        sale.getDescription(),
                        sale.getPrice(),
                        sale.getTaxAmount(),
                        sale.getTotalPaid(),
                        sale.getShippingAddress(),
                        Optional.ofNullable(sale.getShippingStatus())
                                .map(String::toUpperCase)
                                .map(ShippingStatus::valueOf)
                                .orElse(null),
                        Optional.ofNullable(sale.getSaleStatus())
                                .map(String::toUpperCase)
                                .map(SaleStatus::valueOf)
                                .orElse(null)
                ));
    }

    public SaleResponseDto confirmSale(Long saleId, String email, PaymentRequestDto paymentRequestDto, String description, String direction) {
        SaleEntity saleEntity = crudSaleRepository.findByIdSale(saleId);
        UserEntity admin = crudUserRepository.findFirstByEmail(email);
        ArtWorkEntity artWork = crudArtWorkRepository.findFirstByIdArtWork(saleEntity.getArtWork().getIdArtWork());

        if (!saleEntity.getSaleStatus().equals(SaleStatus.PENDING.name())) throw new SaleException(saleId);
        if (artWork.getStatus().equals(ArtWorkStatus.SOLD.name())) throw new ArtWorkNotAvailableException(artWork.getIdArtWork());


        // Se registra el pago de la venta ingresado por el admin
        PaymentEntity payment = paymentMapper.toEntity(paymentRequestDto);
        payment.setSale(saleEntity);
        crudPaymentRepository.save(payment);

        saleEntity.setAdmin(admin);
        saleEntity.setDate(LocalDate.now());
        saleEntity.setDescription(description);
        saleEntity.setShippingAddress(direction);
        saleEntity.setSaleStatus(SaleStatus.APPROVED.name());

        artWork.setStatus(ArtWorkStatus.SOLD.name());
        crudArtWorkRepository.save(artWork);

        return saleMapper.toResponseDto(crudSaleRepository.save(saleEntity));
    }

    public SaleResponseDto updateShippingStatus(Long saleId, ShippingStatus shippingStatus) {
        SaleEntity saleEntity = crudSaleRepository.findByIdSale(saleId);

        if (!saleEntity.getShippingStatus().equals(ShippingStatus.PENDING.name())) throw new RuntimeException("The current Shipping Status must be PENDING to be updated");
        if (!saleEntity.getSaleStatus().equals(SaleStatus.APPROVED.name())) throw new SaleException(saleId, saleEntity.getSaleStatus());

        saleEntity.setShippingStatus(shippingStatus.name());

        return saleMapper.toResponseDto(crudSaleRepository.save(saleEntity));
    }

    public BillingSummaryResponseDto getBillingSummary(LocalDate startDate, LocalDate endDate) {
        List<SaleEntity> sales = this.crudSaleRepository.findApprovedSalesByDateRange(startDate, endDate);

        List<BillingSaleItemResponseDto> items = sales.stream()
                .map(sale -> new BillingSaleItemResponseDto(
                        sale.getIdSale(),
                        sale.getDate(),
                        sale.getPrice(),
                        sale.getProfitPercentage(),
                        sale.getProfitAmount(),
                        sale.getTotalPaid()
                ))
                .toList();

        double totalCollected = sales.stream()
                .map(SaleEntity::getTotalPaid)
                .filter(v -> v != null)
                .mapToDouble(Double::doubleValue)
                .sum();

        double totalMuseumProfit = sales.stream()
                .map(SaleEntity::getProfitAmount)
                .filter(v -> v != null)
                .mapToDouble(Double::doubleValue)
                .sum();

        return new BillingSummaryResponseDto(startDate, endDate, totalCollected, totalMuseumProfit, items);
    }
}

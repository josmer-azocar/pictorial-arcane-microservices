package com.uneg.pictorialArcane.persistence.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.time.LocalDate;

@Entity
@Table(name = "sale")
@AllArgsConstructor
@NoArgsConstructor
@Getter
@Setter
public class SaleEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id_sale")
    private Long idSale;

    @ManyToOne(targetEntity = ArtWorkEntity.class)
    @JoinColumn(name = "id_artwork", referencedColumnName = "id_artwork")
    private ArtWorkEntity artWork;

    @ManyToOne(targetEntity = ClientEntity.class)
    @JoinColumn(name = "dni_client")
    private ClientEntity client;

    @ManyToOne(targetEntity = UserEntity.class)
    @JoinColumn(name = "dni_admin")
    private UserEntity admin;

    @Column(name = "sale_date")
    private LocalDate date;

    @Column(name = "description", length = 255)
    private String description;

    @Column(name = "sale_price")
    private Double price;

    @Column(name = "profit_percentage")
    private Double profitPercentage;

    @Column(name = "profit_amount")
    private Double profitAmount;

    @Column(name = "tax_amount")
    private Double taxAmount;

    @Column(name = "total_paid")
    private Double totalPaid;

    @Column(name = "shipping_address")
    private String shippingAddress;

    @Column(name = "shipping_status")
    private String shippingStatus;

    @Column(name = "sale_status")
    private String saleStatus;
}

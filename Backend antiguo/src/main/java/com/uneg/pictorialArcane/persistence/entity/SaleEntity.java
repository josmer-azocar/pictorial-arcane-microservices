package com.uneg.pictorialArcane.persistence.entity;

import com.uneg.pictorialArcane.persistence.audit.AuditableEntity;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import org.springframework.data.jpa.domain.support.AuditingEntityListener;

import java.time.LocalDate;

@Entity
@Table(name = "sale")
@AllArgsConstructor
@NoArgsConstructor
@Getter
@Setter
@EntityListeners(AuditingEntityListener.class)
public class SaleEntity extends AuditableEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id_sale")
    private Long idSale;

    @ManyToOne(optional = false, targetEntity = ArtWorkEntity.class)
    @JoinColumn(name = "id_artwork", referencedColumnName = "id_artwork", nullable = false)
    private ArtWorkEntity artWork;

    @ManyToOne(optional = false, targetEntity = ClientEntity.class)
    @JoinColumn(name = "dni_client", nullable = false)
    private ClientEntity client;

    @ManyToOne(targetEntity = UserEntity.class)
    @JoinColumn(name = "dni_admin")
    private UserEntity admin;

    @Column(name = "sale_date", nullable = false)
    private LocalDate date;

    @Column(name = "description", length = 255)
    private String description;

    @Column(name = "sale_price", nullable = false)
    private Double price;

    @Column(name = "profit_percentage")
    private Double profitPercentage;

    @Column(name = "profit_amount")
    private Double profitAmount;

    @Column(name = "tax_amount")
    private Double taxAmount;

    @Column(name = "total_paid", nullable = false)
    private Double totalPaid;

    @Column(name = "shipping_address")
    private String shippingAddress;

    @Column(name = "shipping_status", nullable = false)
    private String shippingStatus;

    @Column(name = "sale_status", nullable = false)
    private String saleStatus;

    @OneToOne(mappedBy = "sale", cascade = CascadeType.ALL, orphanRemoval = true)
    private PaymentEntity payment;
}

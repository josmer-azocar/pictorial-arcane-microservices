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
@Table(name = "payments")
@AllArgsConstructor
@NoArgsConstructor
@Getter
@Setter
@EntityListeners(AuditingEntityListener.class)
public class PaymentEntity extends AuditableEntity {

    @Id
    private Long idSale;

    @OneToOne(optional = false)
    @MapsId
    @JoinColumn(name = "id_sale", nullable = false)
    private SaleEntity sale;

    @Column(name = "amount", nullable = false)
    private Double amount;

    @Column(name = "payment_date", nullable = false)
    private LocalDate paymentDate;

    @Column(name = "bank_name", length = 60, nullable = false)
    private String bankName;

    @Column(name = "reference", length = 60)
    private String reference;
}

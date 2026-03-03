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
@Table(name = "payment")
@AllArgsConstructor
@NoArgsConstructor
@Getter
@Setter
@EntityListeners(AuditingEntityListener.class)
public class PaymentEntity extends AuditableEntity {

    @Id
    @Column(name = "id_sale")
    private Long id;

    @OneToOne
    @MapsId
    @JoinColumn(name = "id_sale")
    private SaleEntity sale;

    @Column(name = "amount")
    private Double amount;

    @Column(name = "payment_date")
    private LocalDate paymentDate;

    @Column(name = "bank_name")
    private String Bank;
}

package com.uneg.pictorialArcane.persistence.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.time.LocalDate;

@Entity
@Table(name = "payment")
@AllArgsConstructor
@NoArgsConstructor
@Getter
@Setter
public class PaymentEntity {

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

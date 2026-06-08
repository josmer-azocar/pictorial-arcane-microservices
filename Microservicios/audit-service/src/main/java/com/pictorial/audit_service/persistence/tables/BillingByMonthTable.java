package com.pictorial.audit_service.persistence.tables;

import lombok.*;
import org.springframework.data.cassandra.core.mapping.Column;
import org.springframework.data.cassandra.core.mapping.PrimaryKey;
import org.springframework.data.cassandra.core.mapping.Table;

import java.time.Instant;

@Builder
@Data
@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@Table("billing_by_month")
public class BillingByMonthTable {

    @PrimaryKey
    private BillingByMonthKey key;

    @Column("admin_dni")
    private Long adminDni;

    @Column("artwork_id")
    private Long artworkId;

    @Column("client_dni")
    private Long clientDni;

    @Column("created_at")
    private Instant createdAt;

    private String description;

    @Column("modified_at")
    private Instant modifiedAt;

    @Column("profit_amount")
    private Double profitAmount;

    @Column("profit_percentage")
    private Double profitPercentage;

    @Column("sale_price")
    private Double salePrice;

    @Column("sale_status")
    private String saleStatus;

    @Column("shipping_address")
    private String shippingAddress;

    @Column("shipping_status")
    private String shippingStatus;

    @Column("tax_amount")
    private Double taxAmount;

    @Column("total_paid")
    private Double totalPaid;

}
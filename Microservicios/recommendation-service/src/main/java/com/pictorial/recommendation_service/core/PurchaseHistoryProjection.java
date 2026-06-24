package com.pictorial.recommendation_service.core;

import java.time.ZonedDateTime;

public interface PurchaseHistoryProjection {
    String getComprador();
    String getObra();
    String getArtista();
    String getGenero();
    ZonedDateTime getFechaCompra();
}
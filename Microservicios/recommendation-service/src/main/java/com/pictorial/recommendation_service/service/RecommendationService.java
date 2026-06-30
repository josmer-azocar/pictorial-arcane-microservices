package com.pictorial.recommendation_service.service;

import com.pictorial.recommendation_service.dto.request.ClientSyncRequestDto;
import com.pictorial.recommendation_service.dto.request.PurchaseSyncRequestDto;
import com.pictorial.recommendation_service.dto.request.ViewSyncRequestDto;
import com.pictorial.recommendation_service.dto.response.ArtworkRecommendationResponseDto;
import com.pictorial.recommendation_service.dto.response.PurchaseHistoryResponseDto;
import com.pictorial.recommendation_service.dto.response.TopArtistResponseDto;
import com.pictorial.recommendation_service.dto.response.TopArtworkResponseDto;

import java.util.List;

/**
 * Orquesta las consultas de recomendación sobre el grafo de Neo4j y las
 * operaciones de sincronización eventual de relaciones.
 */
public interface RecommendationService {

    // 7.1 — Recomendaciones por compras de un usuario
    List<ArtworkRecommendationResponseDto> getRecommendationsByPurchases(String compradorId, int limit);

    // 7.2 — Recomendaciones por género de una obra específica
    List<ArtworkRecommendationResponseDto> getRecommendationsByArtworkGenre(Long artworkId);

    // 7.3 — Historial de compras de un usuario
    List<PurchaseHistoryResponseDto> getPurchaseHistory(String compradorId);

    // 7.4 — Top 5 obras más compradas
    List<TopArtworkResponseDto> getTopArtworks();

    // 7.5 — Top 5 artistas más populares
    List<TopArtistResponseDto> getTopArtists();

    // 7.6 — Recomendaciones por obras vistas
    List<ArtworkRecommendationResponseDto> getRecommendationsByViews(String compradorId, int limit);

    // 7.7 — Recomendaciones por la última obra vista
    List<ArtworkRecommendationResponseDto> getRecommendationsByLastViewed(String compradorId, int limit);

    // SYNC.1 — Registrar compra (relación :BOUGHT)
    void syncPurchase(PurchaseSyncRequestDto request);

    // SYNC.3 — Registrar vista (relación :SAW)
    void syncView(ViewSyncRequestDto request);

    // SYNC.4 — Alta/actualización del comprador (nodo :Comprador)
    void syncClient(ClientSyncRequestDto request);
}

package com.pictorial.recommendation_service.web;

import com.pictorial.recommendation_service.dto.request.ClientSyncRequestDto;
import com.pictorial.recommendation_service.dto.request.PurchaseSyncRequestDto;
import com.pictorial.recommendation_service.dto.request.ViewSyncRequestDto;
import com.pictorial.recommendation_service.dto.response.ArtworkRecommendationResponseDto;
import com.pictorial.recommendation_service.dto.response.PurchaseHistoryResponseDto;
import com.pictorial.recommendation_service.dto.response.TopArtistResponseDto;
import com.pictorial.recommendation_service.dto.response.TopArtworkResponseDto;
import com.pictorial.recommendation_service.service.RecommendationService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequiredArgsConstructor
public class RecommendationController {

    private final RecommendationService recommendationService;

    // --- ENDPOINTS COMPATIBLES (api/v1/recommendations/**) ---

    // Recomendaciones personales: requiere usuario autenticado.
    @PreAuthorize("isAuthenticated()")
    @GetMapping("/api/v1/recommendations/user/{compradorId}/recommendations")
    public ResponseEntity<List<ArtworkRecommendationResponseDto>> getRecommendationsByPurchases(
            @PathVariable String compradorId) {
        return ResponseEntity.ok(recommendationService.getRecommendationsByPurchases(compradorId, 10));
    }

    // Público: "obras similares" a una obra, parte de la navegación abierta del catálogo.
    @PreAuthorize("permitAll()")
    @GetMapping("/api/v1/recommendations/artwork/{artworkId}/recommendations")
    public ResponseEntity<List<ArtworkRecommendationResponseDto>> getRecommendationsByArtworkGenre(
            @PathVariable Long artworkId) {
        return ResponseEntity.ok(recommendationService.getRecommendationsByArtworkGenre(artworkId));
    }

    @PreAuthorize("isAuthenticated()")
    @GetMapping("/api/v1/recommendations/user/{compradorId}/purchases/history")
    public ResponseEntity<List<PurchaseHistoryResponseDto>> getPurchaseHistory(
            @PathVariable String compradorId) {
        return ResponseEntity.ok(recommendationService.getPurchaseHistory(compradorId));
    }

    @PreAuthorize("hasRole('ADMIN')")
    @GetMapping("/api/v1/recommendations/admin/top-artworks")
    public ResponseEntity<List<TopArtworkResponseDto>> getTopArtworks() {
        return ResponseEntity.ok(recommendationService.getTopArtworks());
    }

    @PreAuthorize("hasRole('ADMIN')")
    @GetMapping("/api/v1/recommendations/admin/top-artists")
    public ResponseEntity<List<TopArtistResponseDto>> getTopArtists() {
        return ResponseEntity.ok(recommendationService.getTopArtists());
    }

    @PreAuthorize("isAuthenticated()")
    @GetMapping("/api/v1/recommendations/user/{compradorId}/recommendations/by-views")
    public ResponseEntity<List<ArtworkRecommendationResponseDto>> getRecommendationsByViews(
            @PathVariable String compradorId) {
        return ResponseEntity.ok(recommendationService.getRecommendationsByViews(compradorId, 10));
    }

    @PreAuthorize("isAuthenticated()")
    @GetMapping("/api/v1/recommendations/user/{compradorId}/recommendations/last-viewed")
    public ResponseEntity<List<ArtworkRecommendationResponseDto>> getRecommendationsByLastViewed(
            @PathVariable String compradorId) {
        return ResponseEntity.ok(recommendationService.getRecommendationsByLastViewed(compradorId, 10));
    }

    // Sincronización interna desde core-service (lb://, sin token): debe permanecer abierta.
    @PreAuthorize("permitAll()")
    @PostMapping("/api/v1/recommendations/sync/purchase")
    @ResponseStatus(HttpStatus.CREATED)
    public void syncPurchase(@RequestBody PurchaseSyncRequestDto request) {
        recommendationService.syncPurchase(request);
    }

    @PreAuthorize("permitAll()")
    @PostMapping("/api/v1/recommendations/sync/view")
    @ResponseStatus(HttpStatus.CREATED)
    public void syncView(@RequestBody ViewSyncRequestDto request) {
        recommendationService.syncView(request);
    }

    @PreAuthorize("permitAll()")
    @PostMapping("/api/v1/recommendations/sync/client")
    @ResponseStatus(HttpStatus.CREATED)
    public void syncClient(@RequestBody ClientSyncRequestDto request) {
        recommendationService.syncClient(request);
    }

    // --- NUEVOS ENDPOINTS SOLICITADOS POR EL USUARIO ---

    // GET /api/recommendations/by-purchases/{userId}
    @PreAuthorize("isAuthenticated()")
    @GetMapping("/api/recommendations/by-purchases/{userId}")
    public ResponseEntity<List<ArtworkRecommendationResponseDto>> getRecommendationsByPurchasesNew(
            @PathVariable("userId") String userId,
            @RequestParam(value = "limit", defaultValue = "10") int limit) {
        return ResponseEntity.ok(recommendationService.getRecommendationsByPurchases(userId, limit));
    }

    // GET /api/recommendations/by-artwork/{artworkId}
    @PreAuthorize("permitAll()")
    @GetMapping("/api/recommendations/by-artwork/{artworkId}")
    public ResponseEntity<List<ArtworkRecommendationResponseDto>> getRecommendationsByArtworkGenreNew(
            @PathVariable("artworkId") Long artworkId) {
        return ResponseEntity.ok(recommendationService.getRecommendationsByArtworkGenre(artworkId));
    }

    // GET /api/users/{userId}/purchase-history
    @PreAuthorize("isAuthenticated()")
    @GetMapping("/api/users/{userId}/purchase-history")
    public ResponseEntity<List<PurchaseHistoryResponseDto>> getPurchaseHistoryNew(
            @PathVariable("userId") String userId) {
        return ResponseEntity.ok(recommendationService.getPurchaseHistory(userId));
    }

    // GET /api/recommendations/by-views/{userId}
    @PreAuthorize("isAuthenticated()")
    @GetMapping("/api/recommendations/by-views/{userId}")
    public ResponseEntity<List<ArtworkRecommendationResponseDto>> getRecommendationsByViewsNew(
            @PathVariable("userId") String userId,
            @RequestParam(value = "limit", defaultValue = "10") int limit) {
        return ResponseEntity.ok(recommendationService.getRecommendationsByViews(userId, limit));
    }

    // GET /api/recommendations/by-last-viewed/{userId}
    @PreAuthorize("isAuthenticated()")
    @GetMapping("/api/recommendations/by-last-viewed/{userId}")
    public ResponseEntity<List<ArtworkRecommendationResponseDto>> getRecommendationsByLastViewedNew(
            @PathVariable("userId") String userId,
            @RequestParam(value = "limit", defaultValue = "10") int limit) {
        return ResponseEntity.ok(recommendationService.getRecommendationsByLastViewed(userId, limit));
    }
}

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
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api/v1/recommendations")
@RequiredArgsConstructor
public class RecommendationController {

    private final RecommendationService recommendationService;


    @GetMapping("/user/{compradorId}/recommendations")
    public ResponseEntity<List<ArtworkRecommendationResponseDto>> getRecommendationsByPurchases(
            @PathVariable String compradorId) {
        return ResponseEntity.ok(recommendationService.getRecommendationsByPurchases(compradorId));
    }


    @GetMapping("/artwork/{artworkId}/recommendations")
    public ResponseEntity<List<ArtworkRecommendationResponseDto>> getRecommendationsByArtworkGenre(
            @PathVariable Long artworkId) {
        return ResponseEntity.ok(recommendationService.getRecommendationsByArtworkGenre(artworkId));
    }


    @GetMapping("/user/{compradorId}/purchases/history")
    public ResponseEntity<List<PurchaseHistoryResponseDto>> getPurchaseHistory(
            @PathVariable String compradorId) {
        return ResponseEntity.ok(recommendationService.getPurchaseHistory(compradorId));
    }


    @GetMapping("/admin/top-artworks")
    public ResponseEntity<List<TopArtworkResponseDto>> getTopArtworks() {
        return ResponseEntity.ok(recommendationService.getTopArtworks());
    }


    @GetMapping("/admin/top-artists")
    public ResponseEntity<List<TopArtistResponseDto>> getTopArtists() {
        return ResponseEntity.ok(recommendationService.getTopArtists());
    }


    @GetMapping("/user/{compradorId}/recommendations/by-views")
    public ResponseEntity<List<ArtworkRecommendationResponseDto>> getRecommendationsByViews(
            @PathVariable String compradorId) {
        return ResponseEntity.ok(recommendationService.getRecommendationsByViews(compradorId));
    }


    @GetMapping("/user/{compradorId}/recommendations/last-viewed")
    public ResponseEntity<List<ArtworkRecommendationResponseDto>> getRecommendationsByLastViewed(
            @PathVariable String compradorId) {
        return ResponseEntity.ok(recommendationService.getRecommendationsByLastViewed(compradorId));
    }


    @PostMapping("/sync/purchase")
    @ResponseStatus(HttpStatus.CREATED)
    public void syncPurchase(@RequestBody PurchaseSyncRequestDto request) {
        recommendationService.syncPurchase(request);
    }


    @PostMapping("/sync/view")
    @ResponseStatus(HttpStatus.CREATED)
    public void syncView(@RequestBody ViewSyncRequestDto request) {
        recommendationService.syncView(request);
    }


    @PostMapping("/sync/client")
    @ResponseStatus(HttpStatus.CREATED)
    public void syncClient(@RequestBody ClientSyncRequestDto request) {
        recommendationService.syncClient(request);
    }
}

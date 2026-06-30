package com.pictorial.recommendation_service.service;

import com.pictorial.recommendation_service.core.ArtworkRecommendationProjection;
import com.pictorial.recommendation_service.dto.request.ClientSyncRequestDto;
import com.pictorial.recommendation_service.dto.request.PurchaseSyncRequestDto;
import com.pictorial.recommendation_service.dto.request.ViewSyncRequestDto;
import com.pictorial.recommendation_service.dto.response.ArtworkRecommendationResponseDto;
import com.pictorial.recommendation_service.dto.response.PurchaseHistoryResponseDto;
import com.pictorial.recommendation_service.dto.response.TopArtistResponseDto;
import com.pictorial.recommendation_service.dto.response.TopArtworkResponseDto;
import com.pictorial.recommendation_service.mapper.ArtworkRecommendationMapper;
import com.pictorial.recommendation_service.mapper.PurchaseHistoryMapper;
import com.pictorial.recommendation_service.mapper.TopArtistMapper;
import com.pictorial.recommendation_service.mapper.TopArtworkMapper;
import com.pictorial.recommendation_service.repository.ArtistRepository;
import com.pictorial.recommendation_service.repository.ArtworkRepository;
import com.pictorial.recommendation_service.repository.CompradorRepository;
import com.pictorial.recommendation_service.web.exception.ResourceNotFoundException;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class RecommendationServiceImpl implements RecommendationService {

    private final CompradorRepository compradorRepository;
    private final ArtworkRepository artworkRepository;
    private final ArtistRepository artistRepository;

    private final ArtworkRecommendationMapper artworkRecommendationMapper;
    private final PurchaseHistoryMapper purchaseHistoryMapper;
    private final TopArtworkMapper topArtworkMapper;
    private final TopArtistMapper topArtistMapper;

    @Override
    public List<ArtworkRecommendationResponseDto> getRecommendationsByPurchases(String compradorId, int limit) {
        List<ArtworkRecommendationProjection> result =
                compradorRepository.getRecommendationsBasedOnPurchases(compradorId, limit);
        if (result.isEmpty()) {
            result = artworkRepository.findTopAvailableArtworks(limit);
        }
        return artworkRecommendationMapper.toDtoList(result);
    }

    @Override
    public List<ArtworkRecommendationResponseDto> getRecommendationsByArtworkGenre(Long artworkId) {
        List<ArtworkRecommendationProjection> result =
                artworkRepository.findRecommendationsByArtworkGenre(artworkId);
        if (result.isEmpty() && !artworkRepository.existsById(artworkId)) {
            throw new ResourceNotFoundException(
                    "No existe una obra con artworkId '" + artworkId + "' en el grafo.");
        }
        return artworkRecommendationMapper.toDtoList(result);
    }

    @Override
    public List<PurchaseHistoryResponseDto> getPurchaseHistory(String compradorId) {
        var result = compradorRepository.getPurchaseHistoryDetails(compradorId);
        return purchaseHistoryMapper.toDtoList(result);
    }

    @Override
    public List<TopArtworkResponseDto> getTopArtworks() {
        return topArtworkMapper.toDtoList(artworkRepository.findTop5MostBoughtArtworks());
    }

    @Override
    public List<TopArtistResponseDto> getTopArtists() {
        return topArtistMapper.toDtoList(artistRepository.findTop5PopularArtists());
    }

    @Override
    public List<ArtworkRecommendationResponseDto> getRecommendationsByViews(String compradorId, int limit) {
        List<ArtworkRecommendationProjection> result =
                compradorRepository.getRecommendationsBasedOnViews(compradorId, limit);
        if (result.isEmpty()) {
            result = artworkRepository.findTopAvailableArtworks(limit);
        }
        return artworkRecommendationMapper.toDtoList(result);
    }

    @Override
    public List<ArtworkRecommendationResponseDto> getRecommendationsByLastViewed(String compradorId, int limit) {
        List<ArtworkRecommendationProjection> result =
                compradorRepository.getRecommendationsBasedOnLastViewed(compradorId, limit);
        if (result.isEmpty()) {
            result = artworkRepository.findTopAvailableArtworks(limit);
        }
        return artworkRecommendationMapper.toDtoList(result);
    }

    @Override
    public void syncPurchase(PurchaseSyncRequestDto request) {
        validateNotBlank(request.compradorId(), "compradorId");
        validateNotNull(request.artworkId(), "artworkId");
        validateNotBlank(request.fecha(), "fecha");

        // Los nodos de catálogo deben preexistir; no se crean desde el sync.
        if (!compradorRepository.existsByCompradorId(request.compradorId())) {
            throw new ResourceNotFoundException(
                    "No existe un comprador con id '" + request.compradorId() + "' en el grafo.");
        }
        if (!artworkRepository.existsByArtworkId(request.artworkId())) {
            throw new ResourceNotFoundException(
                    "No existe una obra con artworkId '" + request.artworkId() + "' en el grafo.");
        }

        compradorRepository.syncPurchase(request.compradorId(), request.artworkId(), request.fecha());
    }

    @Override
    public void syncView(ViewSyncRequestDto request) {
        validateNotBlank(request.compradorId(), "compradorId");
        validateNotNull(request.artworkId(), "artworkId");
        validateNotBlank(request.fecha(), "fecha");

        // Los nodos de catálogo deben preexistir; no se crean desde el sync.
        if (!compradorRepository.existsByCompradorId(request.compradorId())) {
            throw new ResourceNotFoundException(
                    "No existe un comprador con id '" + request.compradorId() + "' en el grafo.");
        }
        if (!artworkRepository.existsByArtworkId(request.artworkId())) {
            throw new ResourceNotFoundException(
                    "No existe una obra con artworkId '" + request.artworkId() + "' en el grafo.");
        }

        compradorRepository.syncView(request.compradorId(), request.artworkId(), request.fecha());
    }

    @Override
    public void syncClient(ClientSyncRequestDto request) {
        validateNotBlank(request.compradorId(), "compradorId");
        // Este sync crea/actualiza el nodo :Comprador (MERGE), por lo que no exige preexistencia.
        compradorRepository.syncClient(request.compradorId(), request.name(), request.email());
    }

    /**
     * Si la consulta de un usuario no devolvió resultados, distingue entre
     * "el comprador no existe" (404) y "existe pero sin recomendaciones" (lista vacía).
     */
    private void ensureCompradorExistsWhenEmpty(String compradorId, boolean isEmpty) {
        if (isEmpty && !compradorRepository.existsById(compradorId)) {
            throw new ResourceNotFoundException(
                    "No existe un comprador con id '" + compradorId + "' en el grafo.");
        }
    }

    private void validateNotBlank(String value, String fieldName) {
        if (value == null || value.isBlank()) {
            throw new IllegalArgumentException("El campo '" + fieldName + "' es obligatorio.");
        }
    }

    private void validateNotNull(Object value, String fieldName) {
        if (value == null) {
            throw new IllegalArgumentException("El campo '" + fieldName + "' es obligatorio.");
        }
    }
}

package com.pictorial.recommendation_service.web;

import com.pictorial.recommendation_service.dto.response.SearchSmartResponseDto;
import com.pictorial.recommendation_service.service.ArtworkSearchService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/v1/artworks")
public class ArtworkPublicController {
    @Autowired
    private ArtworkSearchService searchService;

    @GetMapping("/search-smart")
    public ResponseEntity<SearchSmartResponseDto> search(
            @RequestParam String query,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size) {
        return ResponseEntity.ok(searchService.busquedaInteligente(query, page, size));
    }
}

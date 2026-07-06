package com.pictorial.recommendation_service.web;

import com.pictorial.recommendation_service.nodes.ArtworkNode;
import com.pictorial.recommendation_service.nodes.CompradorNode;
import com.pictorial.recommendation_service.repository.ArtworkRepository;
import com.pictorial.recommendation_service.repository.CompradorRepository;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.SignatureAlgorithm;
import io.jsonwebtoken.io.Decoders;
import io.jsonwebtoken.security.Keys;
import jakarta.servlet.Filter;
import org.junit.jupiter.api.BeforeAll;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.TestInstance;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.http.HttpHeaders;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.MvcResult;
import org.springframework.test.web.servlet.setup.MockMvcBuilders;
import org.springframework.web.context.WebApplicationContext;

import java.security.Key;
import java.util.List;

import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@SpringBootTest(properties = {
        "eureka.client.enabled=false",
        "spring.cloud.config.enabled=false"
})
@TestInstance(TestInstance.Lifecycle.PER_CLASS)
public class RecommendationControllerIntegrationTest {

    private MockMvc mockMvc;

    @Autowired
    private WebApplicationContext webApplicationContext;

    @Autowired
    private Filter springSecurityFilterChain;

    @Autowired
    private ArtworkRepository artworkRepository;

    @Autowired
    private CompradorRepository compradorRepository;

    private String userToken;
    private String adminToken;
    private Long existingArtworkId = 1L; // fallback default
    private String existingCompradorId = "comprador1"; // fallback default

    @BeforeAll
    public void setup() {
        // Inicializar MockMvc manualmente con el filtro de Spring Security
        mockMvc = MockMvcBuilders.webAppContextSetup(webApplicationContext)
                .addFilter(springSecurityFilterChain)
                .build();

        // Generar tokens JWT usando el secreto por defecto
        byte[] keyBytes = Decoders.BASE64.decode("586E3272357538782F413F4428472B4B6250655368566859703373373676397924");
        Key key = Keys.hmacShaKeyFor(keyBytes);

        userToken = "Bearer " + Jwts.builder()
                .setSubject("test-user@pictorial.com")
                .claim("roles", List.of("ROLE_USER"))
                .signWith(key, SignatureAlgorithm.HS256)
                .compact();

        adminToken = "Bearer " + Jwts.builder()
                .setSubject("test-admin@pictorial.com")
                .claim("roles", List.of("ROLE_ADMIN"))
                .signWith(key, SignatureAlgorithm.HS256)
                .compact();

        // Obtener un artwork y comprador reales si existen en la base de datos Neo4j remota
        try {
            List<ArtworkNode> artworks = artworkRepository.findAll();
            if (!artworks.isEmpty()) {
                existingArtworkId = artworks.get(0).getArtworkId();
                System.out.println("TEST INTEGRACION: Obra encontrada con ID: " + existingArtworkId + ", URL Imagen: " + artworks.get(0).getImageUrl());
            } else {
                System.out.println("TEST INTEGRACION: No se encontraron obras en la base de datos remota.");
            }
        } catch (Exception e) {
            System.err.println("Error al buscar obras para inicializar el test: " + e.getMessage());
        }

        try {
            List<CompradorNode> compradores = compradorRepository.findAll();
            if (!compradores.isEmpty()) {
                existingCompradorId = compradores.get(0).getId();
                System.out.println("TEST INTEGRACION: Comprador encontrado con ID: " + existingCompradorId);
            } else {
                System.out.println("TEST INTEGRACION: No se encontraron compradores en la base de datos remota.");
            }
        } catch (Exception e) {
            System.err.println("Error al buscar compradores para inicializar el test: " + e.getMessage());
        }
    }

    @Test
    public void testGetRecommendationsByArtworkGenre() throws Exception {
        mockMvc.perform(get("/api/v1/recommendations/artwork/" + existingArtworkId + "/recommendations"))
                .andDo(result -> printJsonAndVerifyImageUrl(result, "getRecommendationsByArtworkGenre"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$").isArray());
    }

    @Test
    public void testGetRecommendationsByArtworkGenreNew() throws Exception {
        mockMvc.perform(get("/api/recommendations/by-artwork/" + existingArtworkId))
                .andDo(result -> printJsonAndVerifyImageUrl(result, "getRecommendationsByArtworkGenreNew"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$").isArray());
    }

    @Test
    public void testGetRecommendationsByPurchases() throws Exception {
        mockMvc.perform(get("/api/v1/recommendations/user/" + existingCompradorId + "/recommendations")
                        .header(HttpHeaders.AUTHORIZATION, userToken))
                .andDo(result -> printJsonAndVerifyImageUrl(result, "getRecommendationsByPurchases"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$").isArray());
    }

    @Test
    public void testGetRecommendationsByPurchasesNew() throws Exception {
        mockMvc.perform(get("/api/recommendations/by-purchases/" + existingCompradorId)
                        .header(HttpHeaders.AUTHORIZATION, userToken))
                .andDo(result -> printJsonAndVerifyImageUrl(result, "testGetRecommendationsByPurchasesNew"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$").isArray());
    }

    @Test
    public void testGetPurchaseHistory() throws Exception {
        mockMvc.perform(get("/api/v1/recommendations/user/" + existingCompradorId + "/purchases/history")
                        .header(HttpHeaders.AUTHORIZATION, userToken))
                .andDo(result -> printJsonAndVerifyImageUrl(result, "testGetPurchaseHistory"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$").isArray());
    }

    @Test
    public void testGetPurchaseHistoryNew() throws Exception {
        mockMvc.perform(get("/api/users/" + existingCompradorId + "/purchase-history")
                        .header(HttpHeaders.AUTHORIZATION, userToken))
                .andDo(result -> printJsonAndVerifyImageUrl(result, "testGetPurchaseHistoryNew"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$").isArray());
    }

    @Test
    public void testGetTopArtworks() throws Exception {
        mockMvc.perform(get("/api/v1/recommendations/admin/top-artworks")
                        .header(HttpHeaders.AUTHORIZATION, adminToken))
                .andDo(result -> printJsonAndVerifyImageUrl(result, "testGetTopArtworks"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$").isArray());
    }

    @Test
    public void testGetRecommendationsByViews() throws Exception {
        mockMvc.perform(get("/api/v1/recommendations/user/" + existingCompradorId + "/recommendations/by-views")
                        .header(HttpHeaders.AUTHORIZATION, userToken))
                .andDo(result -> printJsonAndVerifyImageUrl(result, "testGetRecommendationsByViews"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$").isArray());
    }

    @Test
    public void testGetRecommendationsByViewsNew() throws Exception {
        mockMvc.perform(get("/api/recommendations/by-views/" + existingCompradorId)
                        .header(HttpHeaders.AUTHORIZATION, userToken))
                .andDo(result -> printJsonAndVerifyImageUrl(result, "testGetRecommendationsByViewsNew"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$").isArray());
    }

    @Test
    public void testGetRecommendationsByLastViewed() throws Exception {
        mockMvc.perform(get("/api/v1/recommendations/user/" + existingCompradorId + "/recommendations/last-viewed")
                        .header(HttpHeaders.AUTHORIZATION, userToken))
                .andDo(result -> printJsonAndVerifyImageUrl(result, "testGetRecommendationsByLastViewed"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$").isArray());
    }

    @Test
    public void testGetRecommendationsByLastViewedNew() throws Exception {
        mockMvc.perform(get("/api/recommendations/by-last-viewed/" + existingCompradorId)
                        .header(HttpHeaders.AUTHORIZATION, userToken))
                .andDo(result -> printJsonAndVerifyImageUrl(result, "testGetRecommendationsByLastViewedNew"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$").isArray());
    }

    private void printJsonAndVerifyImageUrl(MvcResult result, String endpointName) throws Exception {
        int status = result.getResponse().getStatus();
        String content = result.getResponse().getContentAsString();
        System.out.println("Endpoint [" + endpointName + "] returned status: " + status);
        System.out.println("JSON response for [" + endpointName + "]: " + content);

        if (result.getResolvedException() != null) {
            System.err.println("Exception thrown in [" + endpointName + "]:");
            result.getResolvedException().printStackTrace();
        }

        // Validar que si el JSON no está vacío, contenga un campo 'imageUrl'
        if (content.contains("{")) {
            if (!content.contains("\"imageUrl\":") && !content.contains("imageUrl")) {
                throw new AssertionError("La respuesta del endpoint " + endpointName + " no contiene la propiedad 'imageUrl'");
            }
        }
    }
}

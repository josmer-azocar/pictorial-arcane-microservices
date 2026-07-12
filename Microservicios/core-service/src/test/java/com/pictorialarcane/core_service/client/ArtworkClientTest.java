package com.pictorialarcane.core_service.client;

import com.pictorialarcane.core_service.domain.exception.ArtworkNotAvailableException;
import com.sun.net.httpserver.HttpServer;
import org.junit.jupiter.api.AfterEach;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.cloud.client.ServiceInstance;
import org.springframework.cloud.client.loadbalancer.LoadBalancerClient;

import java.net.InetSocketAddress;
import java.net.URI;
import java.nio.charset.StandardCharsets;
import java.util.List;
import java.util.concurrent.CopyOnWriteArrayList;

import static org.junit.jupiter.api.Assertions.assertDoesNotThrow;
import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertThrows;
import static org.junit.jupiter.api.Assertions.assertTrue;
import static org.mockito.Mockito.when;

/**
 * Verifica que las transiciones enviadas al artwork-service construyan una URI válida
 * incluso cuando el actor es nulo (acción automática del sistema): antes markSold con
 * changedBy=null generaba un parámetro vacío que el artwork-service rechazaba con 400.
 * Se usa un HttpServer del JDK como instancia falsa resuelta por el LoadBalancerClient.
 */
@ExtendWith(MockitoExtension.class)
class ArtworkClientTest {

    @Mock
    private LoadBalancerClient loadBalancer;
    @Mock
    private ServiceInstance instance;

    private ArtworkClient artworkClient;
    private HttpServer server;
    private final List<String> requests = new CopyOnWriteArrayList<>();

    @BeforeEach
    void setUp() throws Exception {
        server = HttpServer.create(new InetSocketAddress("127.0.0.1", 0), 0);
        server.createContext("/", exchange -> {
            requests.add(exchange.getRequestURI().toString());
            exchange.sendResponseHeaders(200, -1);
            exchange.close();
        });
        server.start();

        when(loadBalancer.choose("artwork-service")).thenReturn(instance);
        when(instance.getUri()).thenReturn(URI.create("http://127.0.0.1:" + server.getAddress().getPort()));
        artworkClient = new ArtworkClient(loadBalancer);
    }

    @AfterEach
    void tearDown() {
        server.stop(0);
    }

    @Test
    void markSoldConActorNuloUsaActorSistema() {
        assertDoesNotThrow(() -> artworkClient.markSold(42L, null));

        assertEquals(1, requests.size(), "La petición debió llegar al artwork-service");
        String request = requests.get(0);
        assertTrue(request.startsWith("/artwork/sell/42"), "Path inesperado: " + request);
        assertTrue(request.contains("changedBy=0"),
                "changedBy nulo debe enviarse como 0 (actor sistema), pero fue: " + request);
    }

    @Test
    void markSoldConAdminPropagaSuDni() {
        artworkClient.markSold(42L, 20000002L);

        assertEquals(1, requests.size());
        String request = requests.get(0);
        assertTrue(request.startsWith("/artwork/sell/42"), "Path inesperado: " + request);
        assertTrue(request.contains("changedBy=20000002"), "changedBy inesperado: " + request);
    }

    @Test
    void releaseConActorNuloUsaActorSistema() {
        assertDoesNotThrow(() -> artworkClient.release(7L, null));

        assertEquals(1, requests.size());
        String request = requests.get(0);
        assertTrue(request.startsWith("/artwork/release/7"), "Path inesperado: " + request);
        assertTrue(request.contains("changedBy=0"),
                "changedBy nulo debe enviarse como 0 (actor sistema), pero fue: " + request);
    }

    // ------------------------------------------------------------------
    // reserve() debe capturar el nombre de la obra desde el body de la respuesta
    // de artwork-service, sin necesidad de una llamada HTTP adicional.
    // ------------------------------------------------------------------

    @Test
    void reserveDevuelveElNombreDeLaObraIncluidoEnLaRespuesta() throws Exception {
        server.createContext("/artwork/reserve/42", exchange -> {
            requests.add(exchange.getRequestURI().toString());
            String body = "{\"id\":\"665f1a2b3c4d5e6f7a8b9c0d\",\"artworkId\":42,"
                    + "\"name\":\"La noche estrellada\",\"status\":\"RESERVED\",\"price\":1500.0,"
                    + "\"artistId\":\"a1\",\"artistName\":\"Van Gogh\",\"genreId\":\"g1\","
                    + "\"genreName\":\"Post-impresionismo\",\"imageUrl\":\"http://img/1.jpg\"}";
            byte[] bytes = body.getBytes(StandardCharsets.UTF_8);
            exchange.getResponseHeaders().add("Content-Type", "application/json");
            exchange.sendResponseHeaders(200, bytes.length);
            exchange.getResponseBody().write(bytes);
            exchange.close();
        });

        String artworkName = artworkClient.reserve(42L, 20000002L);

        assertEquals("La noche estrellada", artworkName);
        assertEquals(1, requests.size());
        assertTrue(requests.get(0).startsWith("/artwork/reserve/42"), "Path inesperado: " + requests.get(0));
        assertTrue(requests.get(0).contains("changedBy=20000002"), "changedBy inesperado: " + requests.get(0));
    }

    @Test
    void reserveConObraNoDisponibleLanzaArtworkNotAvailableException() {
        server.createContext("/artwork/reserve/99", exchange -> {
            requests.add(exchange.getRequestURI().toString());
            byte[] bytes = "{\"error\":\"ARTWORK_NOT_AVAILABLE\"}".getBytes(StandardCharsets.UTF_8);
            exchange.sendResponseHeaders(409, bytes.length);
            exchange.getResponseBody().write(bytes);
            exchange.close();
        });

        assertThrows(ArtworkNotAvailableException.class, () -> artworkClient.reserve(99L, 20000002L));
    }
}

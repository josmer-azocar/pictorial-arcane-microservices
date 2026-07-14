package com.pictorial.recommendation_service.service;

import com.pictorial.recommendation_service.dto.response.SearchSmartResponseDto;
import com.pictorial.recommendation_service.nodes.ArtworkNode;
import com.pictorial.recommendation_service.repository.ArtworkRepository;
import org.springframework.ai.chat.client.ChatClient;
import org.springframework.ai.embedding.EmbeddingModel;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.PageRequest;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;

@Service
public class ArtworkSearchService {

    private static final double SIMILARITY_THRESHOLD = 0.65; // Umbral de similitud
    private static final int MAX_QUERY_LENGTH = 300; // Tope razonable para un texto de busqueda

    // Tope de candidatos que se le piden a Neo4j (kNN aproximado). A diferencia
    // de una query de Mongo, un índice vectorial no tiene un "total de matches"
    // real sin escanear todo; paginamos sobre este pool acotado en vez de eso.
    private static final int MAX_RESULTS = 100;

    private static final String SYSTEM_PROMPT = """
            Sos el asistente de búsqueda de una galería de arte online. Vas a recibir el texto
            de búsqueda de un usuario y tenés que devolver dos campos:
            - tabu: true si el texto trata temas tabú, ofensivos, violentos, sexuales, ilegales
              o inapropiados para una galería de arte; false en cualquier otro caso.
            - mensaje: un comentario breve (una oración corta, máximo 20 palabras), simpático y
              preciso, relacionado con el tema de la búsqueda, en español. Si tabu es true, el
              mensaje debe ser exactamente: "No podemos procesar ese tipo de búsquedas."
            """;

    @Autowired
    private EmbeddingModel embeddingModel;

    @Autowired
    private ArtworkRepository artworkRepository;

    private final ChatClient chatClient;

    @Value("${spring.ai.vectorstore.neo4j.index-name}")
    private String indexName;

    public ArtworkSearchService(ChatClient.Builder chatClientBuilder) {
        this.chatClient = chatClientBuilder.build();
    }

    public SearchSmartResponseDto busquedaInteligente(String promptUsuario, int page, int size) {
        validarQuery(promptUsuario);
        PageRequest pageRequest = PageRequest.of(Math.max(page, 0), Math.max(size, 1));

        // 1. Un solo llamado al chat: clasifica si el tema es tabú y arma el
        // comentario corto que va en la respuesta.
        Comentario comentario = generarComentario(promptUsuario);

        if (comentario.tabu()) {
            return new SearchSmartResponseDto(comentario.mensaje(), new PageImpl<>(List.of(), pageRequest, 0));
        }

        // 2. Generamos el embedding del prompt con Azure OpenAI
        float[] queryVector = embeddingModel.embed(promptUsuario);

        // 3. Pedimos siempre el mismo tope (MAX_RESULTS) en una única llamada y
        // paginamos en memoria sobre ese pool. El kNN de Neo4j es aproximado: pedir
        // un k distinto por página (ej. 3 y luego 6) no garantiza que el top-3 sea
        // un prefijo estable del top-6, y termina duplicando/reordenando obras entre
        // páginas. Con un k fijo, el ranking es consistente entre llamadas.
        List<ArtworkNode> candidatos = artworkRepository.findSimilarArtworks(indexName, MAX_RESULTS,
                toDoubleList(queryVector), SIMILARITY_THRESHOLD);

        int desde = (int) pageRequest.getOffset();
        List<ArtworkNode> contenido = desde >= candidatos.size()
                ? List.of()
                : candidatos.subList(desde, Math.min(desde + pageRequest.getPageSize(), candidatos.size()));

        Page<ArtworkNode> obras = new PageImpl<>(contenido, pageRequest, candidatos.size());
        return new SearchSmartResponseDto(comentario.mensaje(), obras);
    }

    private void validarQuery(String promptUsuario) {
        if (promptUsuario == null || promptUsuario.isBlank()) {
            throw new IllegalArgumentException("El texto de búsqueda no puede estar vacío.");
        }
        if (promptUsuario.length() > MAX_QUERY_LENGTH) {
            throw new IllegalArgumentException(
                    "El texto de búsqueda no puede superar los " + MAX_QUERY_LENGTH + " caracteres.");
        }
    }

    private Comentario generarComentario(String promptUsuario) {
        return chatClient.prompt()
                .system(SYSTEM_PROMPT)
                .user(promptUsuario)
                .call()
                .entity(Comentario.class);
    }

    private List<Double> toDoubleList(float[] vector) {
        List<Double> doubleList = new ArrayList<>(vector.length);
        for (float f : vector) {
            doubleList.add((double) f);
        }
        return doubleList;
    }

    private record Comentario(boolean tabu, String mensaje) {}
}

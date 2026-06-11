package com.pictorial.artwork_service.document;

import lombok.*;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.index.Indexed;
import org.springframework.data.mongodb.core.mapping.Document;

import java.time.LocalDateTime;

@Builder
@Data
@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@Document(collection = "artworks")
public class ArtWorkDocument {

    @Id
    private String id;

    // Clave de negocio numérica compartida con core-service y audit-service (que usan Long).
    @Indexed(unique = true)
    private Long artworkId;

    private String name;
    private String status;
    private Object type_details;
    private double price;
    private String artistId;
    private String artistName;
    private GenreDocument genre;
    private String imageUrl;
    private LocalDateTime createdAt;
    private LocalDateTime modifiedAt;
}

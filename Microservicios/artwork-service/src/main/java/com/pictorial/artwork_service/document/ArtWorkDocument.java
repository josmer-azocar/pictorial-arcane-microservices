package com.pictorial.artwork_service.document;

import lombok.*;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;
import org.springframework.data.mongodb.core.mapping.DocumentReference;

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

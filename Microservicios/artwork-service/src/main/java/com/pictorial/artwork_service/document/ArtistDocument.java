package com.pictorial.artwork_service.document;

import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import lombok.*;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;
import org.springframework.data.mongodb.core.mapping.DocumentReference;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.HashSet;
import java.util.Set;

@Builder
@Data
@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@Document(collection = "artists")
public class ArtistDocument {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private String id;

    private String name;
    private String lastName;
    private String nationality;
    private String biography;
    private Double commissionRate;
    private String imageUrl;
    private LocalDate birthdate;

    @DocumentReference
    @Builder.Default
    private Set<GenreDocument> genres = new HashSet<>();

    private LocalDateTime createdAt;
    private LocalDateTime modifiedAt;
}

package com.pictorial.artwork_service.service;

import com.azure.storage.blob.BlobClient;
import com.azure.storage.blob.BlobContainerClient;
import com.azure.storage.blob.BlobServiceClientBuilder;
import com.pictorial.artwork_service.document.ArtWorkDocument;
import com.pictorial.artwork_service.document.ArtistDocument;
import com.pictorial.artwork_service.repository.ArtWorkRepository;
import com.pictorial.artwork_service.repository.ArtistRepository;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.Map;
import java.util.UUID;

@Service
public class AzureBlobService {

    @Value("${azure.storage.connection-string}")
    private String connectionString;

    @Value("${azure.storage.container-name}")
    private String containerName;

    private final ArtWorkRepository artWorkRepository;
    private final ArtistRepository artistRepository;

    public AzureBlobService(ArtWorkRepository artWorkRepository, ArtistRepository artistRepository) {
        this.artWorkRepository = artWorkRepository;
        this.artistRepository = artistRepository;
    }

    public String uploadImage(MultipartFile file) throws IOException {
        // Nos conectamos al contenedor de Azure
        BlobContainerClient containerClient = new BlobServiceClientBuilder()
                .connectionString(connectionString)
                .buildClient()
                .getBlobContainerClient(containerName);

        // Generamos un nombre único para evitar que se sobreescriban fotos con el mismo nombre
        String originalFilename = file.getOriginalFilename();
        String uniqueName = UUID.randomUUID().toString() + "-" + originalFilename;

        // Preparamos el cliente para este archivo en específico
        BlobClient blobClient = containerClient.getBlobClient(uniqueName);

        blobClient.upload(file.getInputStream(), file.getSize(), true);

        return blobClient.getBlobUrl();
    }

    public String uploadArtworkImage(String id, MultipartFile file) throws IOException {
        ArtWorkDocument artWork = artWorkRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Artwork not found"));

        String imageUrl = uploadImage(file);

        artWork.setImageUrl(imageUrl);
        artWorkRepository.save(artWork);

        return imageUrl;
    }

    public void deleteImage(String imageUrl) {
        if (imageUrl == null || imageUrl.isBlank()) {
            return;
        }
        try {
            String blobName = imageUrl.substring(imageUrl.lastIndexOf("/") + 1);

            BlobContainerClient containerClient = new BlobServiceClientBuilder()
                    .connectionString(connectionString)
                    .buildClient()
                    .getBlobContainerClient(containerName);

            BlobClient blobClient = containerClient.getBlobClient(blobName);

            blobClient.deleteIfExists();

            System.out.println("Imagen eliminada de Azure: " + blobName);

        } catch (Exception e) {
            System.err.println("Error al intentar eliminar el blob de Azure: " + e.getMessage());
            throw new RuntimeException("No se pudo eliminar la imagen del servidor en la nube.");
        }
    }

    public ResponseEntity<?> deleteArtworkImage(String id) {
        ArtWorkDocument artWork = artWorkRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("ArtWork not found"));

        if (artWork.getImageUrl() == null) {
            return ResponseEntity.badRequest().body(Map.of("error", "La obra no tiene ninguna imagen asociada."));
        }
        deleteImage(artWork.getImageUrl());
        artWork.setImageUrl(null);
        artWorkRepository.save(artWork);
        return ResponseEntity.ok().build();
    }

    public String uploadArtistImage(String id, MultipartFile file) throws IOException {
        ArtistDocument artist = artistRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Artist not found"));

        String imageUrl = uploadImage(file);

        artist.setImageUrl(imageUrl);
        artistRepository.save(artist);

        return imageUrl;
    }

    public ResponseEntity<?> deleteArtistImage(String id) {
        ArtistDocument artist = artistRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Artist not found"));

        if (artist.getImageUrl() == null) {
            return ResponseEntity.badRequest().body(Map.of("error", "el artista no tiene ninguna imagen asociada."));
        }
        deleteImage(artist.getImageUrl());
        artist.setImageUrl(null);
        artistRepository.save(artist);
        return ResponseEntity.ok().build();
    }
}

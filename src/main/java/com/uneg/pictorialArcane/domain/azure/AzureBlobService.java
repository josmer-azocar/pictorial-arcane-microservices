package com.uneg.pictorialArcane.domain.azure;

import com.azure.storage.blob.BlobClient;
import com.azure.storage.blob.BlobContainerClient;
import com.azure.storage.blob.BlobServiceClientBuilder;
import com.uneg.pictorialArcane.persistence.crud_repository.CrudArtWorkRepository;
import com.uneg.pictorialArcane.persistence.crud_repository.CrudArtistRepository;
import com.uneg.pictorialArcane.persistence.entity.ArtWorkEntity;
import com.uneg.pictorialArcane.persistence.entity.ArtistEntity;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.Map;
import java.util.UUID;

@Service
public class AzureBlobService {

    @Value("${STORAGE_CONNECTION}")
    private String connectionString;

    @Value("pictorialpictures")
    private String containerName;

    private final CrudArtWorkRepository crudArtWorkRepository;
    private final CrudArtistRepository crudArtistRepository;

    public AzureBlobService(CrudArtWorkRepository crudArtWorkRepository, CrudArtistRepository crudArtistRepository) {
        this.crudArtWorkRepository = crudArtWorkRepository;
        this.crudArtistRepository = crudArtistRepository;
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

    public String uploadArtworkImage(Long id, MultipartFile file) throws IOException {
        ArtWorkEntity artWork = crudArtWorkRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Artwork not found"));

        String imageUrl = uploadImage(file);

        artWork.setImageUrl(imageUrl);
        crudArtWorkRepository.save(artWork);

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

    public ResponseEntity deleteArtworkImage(Long id) {
        ArtWorkEntity artWork = crudArtWorkRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("ArtWork not found"));

        if (artWork.getImageUrl() == null) {
            return ResponseEntity.badRequest().body(Map.of("error", "La obra no tiene ninguna imagen asociada."));
        }
        deleteImage(artWork.getImageUrl());
        artWork.setImageUrl(null);
        crudArtWorkRepository.save(artWork);
        return ResponseEntity.ok().build();
    }

    public String uploadArtistImage(Long id, MultipartFile file) throws IOException {
        ArtistEntity artist = crudArtistRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Artist not found"));

        String imageUrl = uploadImage(file);

        artist.setImageUrl(imageUrl);
        crudArtistRepository.save(artist);

        return imageUrl;
    }

    public ResponseEntity deleteArtistImage(Long id) {
        ArtistEntity artist = crudArtistRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Artist not found"));

        if (artist.getImageUrl() == null) {
            return ResponseEntity.badRequest().body(Map.of("error", "el artista no tiene ninguna imagen asociada."));
        }
        deleteImage(artist.getImageUrl());
        artist.setImageUrl(null);
        crudArtistRepository.save(artist);
        return ResponseEntity.ok().build();
    }
}
package com.pictorial.artwork_service.service;

import com.pictorial.artwork_service.document.*;
import com.pictorial.artwork_service.repository.ArtistRepository;
import com.pictorial.artwork_service.repository.ArtWorkRepository;
import com.pictorial.artwork_service.repository.GenreRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;

import java.sql.*;
import java.time.LocalDateTime;
import java.util.*;

@Service
public class MigrationService {

    private static final Logger log = LoggerFactory.getLogger(MigrationService.class);

    private final GenreRepository genreRepository;
    private final ArtistRepository artistRepository;
    private final ArtWorkRepository artWorkRepository;

    public MigrationService(GenreRepository genreRepository, ArtistRepository artistRepository,
                            ArtWorkRepository artWorkRepository) {
        this.genreRepository = genreRepository;
        this.artistRepository = artistRepository;
        this.artWorkRepository = artWorkRepository;
    }

    public Map<String, Object> migrate(String dbUrl, String dbUser, String dbPassword) {
        Map<String, Object> result = new LinkedHashMap<>();

        try (Connection conn = DriverManager.getConnection(dbUrl, dbUser, dbPassword)) {
            result.put("genres", migrateGenres(conn));
            result.put("artists", migrateArtists(conn));
            result.put("artistGenres", migrateArtistGenres(conn));
            result.put("artworks", migrateArtworks(conn));
            result.put("status", "success");
        } catch (Exception e) {
            log.error("Migration failed", e);
            result.put("status", "error");
            result.put("message", e.getMessage());
        }

        return result;
    }

    private Map<String, Object> migrateGenres(Connection conn) throws SQLException {
        long before = genreRepository.count();
        int imported = 0;

        String sql = "SELECT id_genre, name, description FROM genre";
        try (Statement stmt = conn.createStatement(); ResultSet rs = stmt.executeQuery(sql)) {
            while (rs.next()) {
                String id = String.valueOf(rs.getLong("id_genre"));
                if (genreRepository.findById(id).isPresent()) continue;

                GenreDocument doc = new GenreDocument();
                doc.setId(id);
                doc.setName(rs.getString("name"));
                doc.setDescription(rs.getString("description"));
                doc.setCreatedAt(LocalDateTime.now());
                doc.setModifiedAt(LocalDateTime.now());
                genreRepository.save(doc);
                imported++;
            }
        }

        return Map.of("before", before, "imported", imported, "total", genreRepository.count());
    }

    private Map<String, Object> migrateArtists(Connection conn) throws SQLException {
        long before = artistRepository.count();
        int imported = 0;

        String sql = "SELECT id_artist, name, last_name, nationality, biography, commission_rate, image_url, birthdate FROM artist";
        try (Statement stmt = conn.createStatement(); ResultSet rs = stmt.executeQuery(sql)) {
            while (rs.next()) {
                String id = String.valueOf(rs.getLong("id_artist"));
                if (artistRepository.findById(id).isPresent()) continue;

                ArtistDocument doc = new ArtistDocument();
                doc.setId(id);
                doc.setName(rs.getString("name"));
                doc.setLastName(rs.getString("last_name"));
                doc.setNationality(rs.getString("nationality"));
                doc.setBiography(rs.getString("biography"));
                doc.setCommissionRate(rs.getObject("commission_rate", Double.class));
                doc.setImageUrl(rs.getString("image_url"));
                java.sql.Date birthdate = rs.getDate("birthdate");
                if (birthdate != null) {
                    doc.setBirthdate(birthdate.toLocalDate());
                }
                doc.setCreatedAt(LocalDateTime.now());
                doc.setModifiedAt(LocalDateTime.now());
                artistRepository.save(doc);
                imported++;
            }
        }

        return Map.of("before", before, "imported", imported, "total", artistRepository.count());
    }

    private Map<String, Object> migrateArtistGenres(Connection conn) throws SQLException {
        int updated = 0;

        String sql = "SELECT id_artist, id_genre FROM artist_genre";
        try (Statement stmt = conn.createStatement(); ResultSet rs = stmt.executeQuery(sql)) {
            while (rs.next()) {
                String artistId = String.valueOf(rs.getLong("id_artist"));
                String genreId = String.valueOf(rs.getLong("id_genre"));

                Optional<ArtistDocument> opt = artistRepository.findById(artistId);
                if (opt.isPresent()) {
                    ArtistDocument artist = opt.get();
                    if (artist.getGenreIds().add(genreId)) {
                        artistRepository.save(artist);
                        updated++;
                    }
                }
            }
        }

        return Map.of("updated", updated);
    }

    private Map<String, Object> migrateArtworks(Connection conn) throws SQLException {
        long before = artWorkRepository.count();
        int imported = 0;

        String sql = """
                SELECT a.id_artwork, a.name, a.status, a.price, a.id_artist, a.id_genre, a.image_url,
                       g.name AS genre_name, ar.name || ' ' || ar.last_name AS artist_name
                FROM artwork a
                JOIN genre g ON a.id_genre = g.id_genre
                JOIN artist ar ON a.id_artist = ar.id_artist
                """;

        try (Statement stmt = conn.createStatement(); ResultSet rs = stmt.executeQuery(sql)) {
            while (rs.next()) {
                String id = String.valueOf(rs.getLong("id_artwork"));
                if (artWorkRepository.findById(id).isPresent()) continue;

                String genreName = rs.getString("genre_name");
                String normalized = genreName != null ? genreName.trim().toUpperCase() : "";

                ArtWorkDocument doc = buildArtWorkByGenre(normalized, rs, conn);
                artWorkRepository.save(doc);
                imported++;
            }
        }

        return Map.of("before", before, "imported", imported, "total", artWorkRepository.count());
    }

    private ArtWorkDocument buildArtWorkByGenre(String normalized, ResultSet rs, Connection conn) throws SQLException {
        String id = String.valueOf(rs.getLong("id_artwork"));
        String name = rs.getString("name");
        String statusStr = rs.getString("status");
        double price = rs.getDouble("price");
        String artistId = String.valueOf(rs.getLong("id_artist"));
        String genreId = String.valueOf(rs.getLong("id_genre"));
        String imageUrl = rs.getString("image_url");
        String genreName = rs.getString("genre_name");
        String artistName = rs.getString("artist_name");
        ArtWorkStatus status = ArtWorkStatus.valueOf(statusStr.toUpperCase());
        LocalDateTime now = LocalDateTime.now();

        return switch (normalized) {
            case "CERAMIC", "CERÁMICA", "CERAMICA" -> {
                CeramicDocument doc = new CeramicDocument();
                setBaseFields(doc, id, name, status, price, artistId, artistName, genreId, genreName, imageUrl, now);
                loadCeramicFields(doc, id, conn);
                yield doc;
            }
            case "PAINTING", "PINTURA" -> {
                PaintingDocument doc = new PaintingDocument();
                setBaseFields(doc, id, name, status, price, artistId, artistName, genreId, genreName, imageUrl, now);
                loadPaintingFields(doc, id, conn);
                yield doc;
            }
            case "PHOTOGRAPHY", "FOTOGRAFÍA", "FOTOGRAFIA" -> {
                PhotographyDocument doc = new PhotographyDocument();
                setBaseFields(doc, id, name, status, price, artistId, artistName, genreId, genreName, imageUrl, now);
                loadPhotographyFields(doc, id, conn);
                yield doc;
            }
            case "SCULPTURE", "ESCULTURA" -> {
                SculptureDocument doc = new SculptureDocument();
                setBaseFields(doc, id, name, status, price, artistId, artistName, genreId, genreName, imageUrl, now);
                loadSculptureFields(doc, id, conn);
                yield doc;
            }
            case "GOLDSMITH", "ORFEBRERÍA", "ORFEBRERIA" -> {
                GoldsmithDocument doc = new GoldsmithDocument();
                setBaseFields(doc, id, name, status, price, artistId, artistName, genreId, genreName, imageUrl, now);
                loadGoldsmithFields(doc, id, conn);
                yield doc;
            }
            default -> {
                ArtWorkDocument doc = new ArtWorkDocument();
                setBaseFields(doc, id, name, status, price, artistId, artistName, genreId, genreName, imageUrl, now);
                yield doc;
            }
        };
    }

    private void setBaseFields(ArtWorkDocument doc, String id, String name, ArtWorkStatus status, double price,
                               String artistId, String artistName, String genreId, String genreName,
                               String imageUrl, LocalDateTime now) {
        doc.setId(id);
        doc.setName(name);
        doc.setStatus(status);
        doc.setPrice(price);
        doc.setArtistId(artistId);
        doc.setArtistName(artistName);
        doc.setGenreId(genreId);
        doc.setGenreName(genreName);
        doc.setImageUrl(imageUrl);
        doc.setCreatedAt(now);
        doc.setModifiedAt(now);
    }

    private void loadPaintingFields(PaintingDocument doc, String artworkId, Connection conn) {
        String sql = "SELECT technique, holder, style, framed, width, height FROM painting WHERE id_artwork = ?";
        try (PreparedStatement ps = conn.prepareStatement(sql)) {
            ps.setLong(1, Long.parseLong(artworkId));
            try (ResultSet rs = ps.executeQuery()) {
                if (rs.next()) {
                    doc.setTechnique(rs.getString("technique"));
                    doc.setHolder(rs.getString("holder"));
                    doc.setStyle(rs.getString("style"));
                    doc.setFramed(rs.getString("framed"));
                    doc.setWidth(rs.getObject("width", Double.class));
                    doc.setHeight(rs.getObject("height", Double.class));
                }
            }
        } catch (SQLException e) {
            log.warn("Could not load painting fields for artwork {}: {}", artworkId, e.getMessage());
        }
    }

    private void loadSculptureFields(SculptureDocument doc, String artworkId, Connection conn) {
        String sql = "SELECT material, weight, length, width, depth FROM sculpture WHERE id_artwork = ?";
        try (PreparedStatement ps = conn.prepareStatement(sql)) {
            ps.setLong(1, Long.parseLong(artworkId));
            try (ResultSet rs = ps.executeQuery()) {
                if (rs.next()) {
                    doc.setMaterial(rs.getString("material"));
                    doc.setWeight(rs.getObject("weight", Double.class));
                    doc.setLength(rs.getObject("length", Double.class));
                    doc.setWidth(rs.getObject("width", Double.class));
                    doc.setDepth(rs.getObject("depth", Double.class));
                }
            }
        } catch (SQLException e) {
            log.warn("Could not load sculpture fields for artwork {}: {}", artworkId, e.getMessage());
        }
    }

    private void loadCeramicFields(CeramicDocument doc, String artworkId, Connection conn) {
        String sql = "SELECT material_type, technique, finish, cooking_temperature, weight, width, height FROM ceramic WHERE id_artwork = ?";
        try (PreparedStatement ps = conn.prepareStatement(sql)) {
            ps.setLong(1, Long.parseLong(artworkId));
            try (ResultSet rs = ps.executeQuery()) {
                if (rs.next()) {
                    doc.setMaterialType(rs.getString("material_type"));
                    doc.setTechnique(rs.getString("technique"));
                    doc.setFinish(rs.getString("finish"));
                    doc.setCookingTemperature(rs.getObject("cooking_temperature", Double.class));
                    doc.setWeight(rs.getObject("weight", Double.class));
                    doc.setWidth(rs.getObject("width", Double.class));
                    doc.setHeight(rs.getObject("height", Double.class));
                }
            }
        } catch (SQLException e) {
            log.warn("Could not load ceramic fields for artwork {}: {}", artworkId, e.getMessage());
        }
    }

    private void loadPhotographyFields(PhotographyDocument doc, String artworkId, Connection conn) {
        String sql = "SELECT print_type, resolution, color, serial_number, camera FROM photography WHERE id_artwork = ?";
        try (PreparedStatement ps = conn.prepareStatement(sql)) {
            ps.setLong(1, Long.parseLong(artworkId));
            try (ResultSet rs = ps.executeQuery()) {
                if (rs.next()) {
                    doc.setPrintType(rs.getString("print_type"));
                    doc.setResolution(rs.getString("resolution"));
                    doc.setColor(rs.getString("color"));
                    doc.setSerialNumber(rs.getString("serial_number"));
                    doc.setCamera(rs.getString("camera"));
                }
            }
        } catch (SQLException e) {
            log.warn("Could not load photography fields for artwork {}: {}", artworkId, e.getMessage());
        }
    }

    private void loadGoldsmithFields(GoldsmithDocument doc, String artworkId, Connection conn) {
        String sql = "SELECT material, precious_stones, weight FROM goldsmith WHERE id_artwork = ?";
        try (PreparedStatement ps = conn.prepareStatement(sql)) {
            ps.setLong(1, Long.parseLong(artworkId));
            try (ResultSet rs = ps.executeQuery()) {
                if (rs.next()) {
                    doc.setMaterial(rs.getString("material"));
                    doc.setPreciousStones(rs.getString("precious_stones"));
                    doc.setWeight(rs.getObject("weight", Double.class));
                }
            }
        } catch (SQLException e) {
            log.warn("Could not load goldsmith fields for artwork {}: {}", artworkId, e.getMessage());
        }
    }
}

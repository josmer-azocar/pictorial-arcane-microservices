package com.pictorial.artwork_service.service;

import com.pictorial.artwork_service.document.ArtWorkDocument;
import com.pictorial.artwork_service.document.ArtWorkStatus;
import com.pictorial.artwork_service.dto.response.ArtWorkResponseDto;
import com.pictorial.artwork_service.mapper.ArtWorkMapper;
import com.pictorial.artwork_service.repository.ArtWorkRepository;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.data.domain.*;

import java.util.List;

import static org.assertj.core.api.Assertions.assertThat;
import static org.mockito.Mockito.when;

@ExtendWith(MockitoExtension.class)
class ArtWorkServiceTest {

    @Mock
    private ArtWorkRepository artWorkRepository;

    @Mock
    private ArtWorkMapper artWorkMapper;

    @InjectMocks
    private ArtWorkService artWorkService;

    @Test
    void testGetAllWithPagination() {
        // Arrange
        ArtWorkDocument doc = new ArtWorkDocument();
        doc.setId("1");
        doc.setName("La Gioconda");

        ArtWorkResponseDto responseDto = new ArtWorkResponseDto(
                "1", 100L, "La Gioconda", ArtWorkStatus.AVAILABLE, 1000.0,
                "ArtistId", "Artist Name", "GenreId", "Genre Name", "imageUrl"
        );

        PageRequest pageRequest = PageRequest.of(0, 10, Sort.by(Sort.Direction.ASC, "name"));
        Page<ArtWorkDocument> pageResult = new PageImpl<>(List.of(doc), pageRequest, 1);

        when(artWorkRepository.findAll(pageRequest)).thenReturn(pageResult);
        when(artWorkMapper.toResponseDto(doc)).thenReturn(responseDto);

        // Act
        Page<ArtWorkResponseDto> result = artWorkService.getAll(0, 10, "name", Sort.Direction.ASC);

        // Assert
        assertThat(result).isNotNull();
        assertThat(result.getContent()).hasSize(1);
        assertThat(result.getContent().get(0).name()).isEqualTo("La Gioconda");
        assertThat(result.getTotalElements()).isEqualTo(1);
    }
}

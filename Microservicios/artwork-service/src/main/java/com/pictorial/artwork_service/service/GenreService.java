package com.pictorial.artwork_service.service;

import com.pictorial.artwork_service.document.GenreDocument;
import com.pictorial.artwork_service.dto.request.GenreRequestDto;
import com.pictorial.artwork_service.dto.request.UpdateGenreDto;
import com.pictorial.artwork_service.dto.response.GenreResponseDto;
import com.pictorial.artwork_service.exception.DuplicateResourceException;
import com.pictorial.artwork_service.exception.ResourceNotFoundException;
import com.pictorial.artwork_service.mapper.GenreMapper;
import com.pictorial.artwork_service.repository.GenreRepository;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;

@Service
public class GenreService {

}

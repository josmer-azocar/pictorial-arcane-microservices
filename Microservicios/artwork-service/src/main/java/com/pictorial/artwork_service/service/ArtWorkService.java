package com.pictorial.artwork_service.service;

import com.pictorial.artwork_service.document.*;
import com.pictorial.artwork_service.dto.request.*;
import com.pictorial.artwork_service.dto.response.*;
import com.pictorial.artwork_service.exception.ResourceNotFoundException;
import com.pictorial.artwork_service.mapper.ArtWorkMapper;
import com.pictorial.artwork_service.repository.ArtistRepository;
import com.pictorial.artwork_service.repository.ArtWorkRepository;
import com.pictorial.artwork_service.repository.GenreRepository;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Sort;
import org.springframework.data.mongodb.core.MongoTemplate;
import org.springframework.data.mongodb.core.query.Criteria;
import org.springframework.data.mongodb.core.query.Query;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Service
public class ArtWorkService {

}

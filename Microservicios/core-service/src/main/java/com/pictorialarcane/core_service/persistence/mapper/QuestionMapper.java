package com.pictorialarcane.core_service.persistence.mapper;

import com.pictorialarcane.core_service.domain.dto.response.QuestionResponseDto;
import com.pictorialarcane.core_service.persistence.entity.QuestionEntity;
import org.mapstruct.Mapper;
import java.util.List;

@Mapper(componentModel = "spring")
public interface QuestionMapper {

    QuestionResponseDto toResponseDto(QuestionEntity entity);

    List<QuestionResponseDto> toResponseDto(Iterable<QuestionEntity> entities);

}

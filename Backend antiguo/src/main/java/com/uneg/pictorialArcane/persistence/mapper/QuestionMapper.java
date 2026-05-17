package com.uneg.pictorialArcane.persistence.mapper;

import com.uneg.pictorialArcane.domain.dto.response.QuestionResponseDto;
import com.uneg.pictorialArcane.persistence.entity.QuestionEntity;
import org.mapstruct.Mapper;
import java.util.List;

@Mapper(componentModel = "spring")
public interface QuestionMapper {

    QuestionResponseDto toResponseDto(QuestionEntity entity);

    List<QuestionResponseDto> toResponseDto(Iterable<QuestionEntity> entities);

}

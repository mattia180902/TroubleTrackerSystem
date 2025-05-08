package com.ticketing.api.mapper;

import com.ticketing.api.dto.CategoryDTO;
import com.ticketing.api.entity.Category;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;

@Mapper(componentModel = "spring")
public interface CategoryMapper {
    
    CategoryDTO toDTO(Category category);
    
    Category toEntity(CategoryDTO categoryDTO);
}
package com.ticketing.api.service;

import com.ticketing.api.dto.CategoryDTO;
import com.ticketing.api.entity.Category;
import com.ticketing.api.exception.ResourceNotFoundException;
import com.ticketing.api.mapper.CategoryMapper;
import com.ticketing.api.repository.CategoryRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class CategoryService {
    
    private final CategoryRepository categoryRepository;
    private final CategoryMapper categoryMapper;
    
    public List<CategoryDTO> getAllCategories() {
        return categoryRepository.findAll().stream()
                .map(categoryMapper::toDTO)
                .collect(Collectors.toList());
    }
    
    public CategoryDTO getCategoryById(Long id) {
        Category category = categoryRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Category", "id", id));
        return categoryMapper.toDTO(category);
    }
    
    @Transactional
    public CategoryDTO createCategory(CategoryDTO categoryDTO) {
        // Check if category with the same name already exists
        if (categoryRepository.existsByName(categoryDTO.getName())) {
            throw new IllegalArgumentException("Category with name " + categoryDTO.getName() + " already exists");
        }
        
        Category category = categoryMapper.toEntity(categoryDTO);
        Category savedCategory = categoryRepository.save(category);
        return categoryMapper.toDTO(savedCategory);
    }
    
    @Transactional
    public CategoryDTO updateCategory(Long id, CategoryDTO categoryDTO) {
        Category category = categoryRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Category", "id", id));
        
        // Check if another category with the same name already exists
        if (!category.getName().equals(categoryDTO.getName()) && 
                categoryRepository.existsByName(categoryDTO.getName())) {
            throw new IllegalArgumentException("Category with name " + categoryDTO.getName() + " already exists");
        }
        
        category.setName(categoryDTO.getName());
        category.setDescription(categoryDTO.getDescription());
        
        Category updatedCategory = categoryRepository.save(category);
        return categoryMapper.toDTO(updatedCategory);
    }
    
    @Transactional
    public void deleteCategory(Long id) {
        Category category = categoryRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Category", "id", id));
        
        // Check if the category is associated with any tickets
        if (!category.getTickets().isEmpty()) {
            throw new IllegalStateException("Cannot delete category that is associated with tickets");
        }
        
        categoryRepository.delete(category);
    }
}
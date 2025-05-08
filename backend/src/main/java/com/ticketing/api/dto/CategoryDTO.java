package com.ticketing.api.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import javax.validation.constraints.NotBlank;
import javax.validation.constraints.Size;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class CategoryDTO {
    
    private Long id;
    
    @NotBlank(message = "Category name is required")
    @Size(min = 2, max = 50, message = "Category name must be between 2 and 50 characters")
    private String name;
    
    @Size(max = 255, message = "Description cannot be longer than 255 characters")
    private String description;
    
    // Stats for showing in UI
    private Integer ticketCount;
}
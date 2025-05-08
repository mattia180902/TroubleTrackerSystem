package com.ticketing.api.dto;

import com.fasterxml.jackson.annotation.JsonInclude;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import java.time.LocalDateTime;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@JsonInclude(JsonInclude.Include.NON_NULL)
public class CommentDTO {
    private Long id;
    
    @NotBlank(message = "Content is required")
    @Size(min = 1, max = 4000, message = "Content must be between 1 and 4000 characters")
    private String content;
    
    @NotNull(message = "Ticket ID is required")
    private Long ticketId;
    
    private Long userId;
    private UserDTO user;
    
    private LocalDateTime createdAt;
}
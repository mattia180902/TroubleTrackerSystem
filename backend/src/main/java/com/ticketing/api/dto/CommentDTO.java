package com.ticketing.api.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import javax.validation.constraints.NotBlank;
import javax.validation.constraints.NotNull;
import javax.validation.constraints.Size;
import java.time.LocalDateTime;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class CommentDTO {
    
    private Long id;
    
    @NotBlank(message = "Comment content is required")
    @Size(min = 2, message = "Comment must be at least 2 characters")
    private String content;
    
    @NotNull(message = "Ticket ID is required")
    private Long ticketId;
    
    @NotNull(message = "User ID is required")
    private Long userId;
    
    private String userName;
    private String userAvatar;
    
    private LocalDateTime createdAt;
}
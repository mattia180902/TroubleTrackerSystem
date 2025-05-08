package com.ticketing.api.dto;

import com.ticketing.api.enums.Priority;
import com.ticketing.api.enums.Status;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import javax.validation.constraints.NotBlank;
import javax.validation.constraints.NotNull;
import javax.validation.constraints.Size;
import java.time.LocalDateTime;
import java.util.List;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class TicketDTO {
    
    private Long id;
    
    @NotBlank(message = "Subject is required")
    @Size(min = 5, max = 100, message = "Subject must be between 5 and 100 characters")
    private String subject;
    
    @NotBlank(message = "Description is required")
    @Size(min = 10, message = "Description must be at least 10 characters")
    private String description;
    
    @NotNull(message = "Status is required")
    private Status status;
    
    @NotNull(message = "Priority is required")
    private Priority priority;
    
    private Long categoryId;
    private String categoryName;
    
    @NotNull(message = "Created by user is required")
    private Long createdById;
    private String createdByName;
    
    private Long assignedToId;
    private String assignedToName;
    
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
    private LocalDateTime dueDate;
    private LocalDateTime resolvedAt;
    
    private String resolution;
    
    // For detail view
    private List<CommentDTO> comments;
    private List<TicketHistoryDTO> history;
    
    // Stats
    private Long commentsCount;
    private Long timeToFirstResponse;
    private Long resolutionTime;
}
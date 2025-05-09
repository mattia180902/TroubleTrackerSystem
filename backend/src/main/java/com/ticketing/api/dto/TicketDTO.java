package com.ticketing.api.dto;

import com.fasterxml.jackson.annotation.JsonInclude;
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
@JsonInclude(JsonInclude.Include.NON_NULL)
public class TicketDTO {
    
    private Long id;
    
    @NotBlank(message = "Subject is required")
    @Size(min = 5, max = 200, message = "Subject must be between 5 and 200 characters")
    private String subject;
    
    @NotBlank(message = "Description is required")
    @Size(min = 10, max = 4000, message = "Description must be between 10 and 4000 characters")
    private String description;
    
    @NotNull(message = "Status is required")
    private Status status;
    
    @NotNull(message = "Priority is required")
    private Priority priority;
    
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
    private LocalDateTime resolvedAt;
    private LocalDateTime closedAt;
    private LocalDateTime dueDate;
    
    // Relationships
    private Long categoryId;
    private String categoryName;
    
    private Long createdById;
    private String createdByName;
    
    private Long assignedToId;
    private String assignedToName;
    
    // Related data, not mapped directly to entity
    private List<CommentDTO> comments;
    private List<TicketHistoryDTO> historyItems;
    private List<AttachmentDTO> attachments;
    
    // Statistics
    private Long responseTime;
    private Long resolutionTime;
}
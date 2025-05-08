package com.ticketing.api.dto;

import com.fasterxml.jackson.annotation.JsonInclude;
import com.ticketing.api.entity.Ticket;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
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
    private Ticket.TicketStatus status;
    
    @NotNull(message = "Priority is required")
    private Ticket.TicketPriority priority;
    
    private Long categoryId;
    private CategoryDTO category;
    
    private Long createdById;
    private UserDTO createdBy;
    
    private Long assignedToId;
    private UserDTO assignedTo;
    
    private List<CommentDTO> comments;
    private List<TicketHistoryDTO> history;
    
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
}
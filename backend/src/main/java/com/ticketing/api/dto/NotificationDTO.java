package com.ticketing.api.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import javax.validation.constraints.NotBlank;
import javax.validation.constraints.NotNull;
import java.time.LocalDateTime;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class NotificationDTO {
    
    private Long id;
    
    @NotBlank(message = "Message is required")
    private String message;
    
    @NotNull(message = "User ID is required")
    private Long userId;
    
    private String type;
    private boolean read;
    private Long ticketId;
    private String ticketSubject;
    
    private LocalDateTime createdAt;
}
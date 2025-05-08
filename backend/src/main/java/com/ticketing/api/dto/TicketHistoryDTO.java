package com.ticketing.api.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class TicketHistoryDTO {
    
    private Long id;
    private String action;
    private String oldValue;
    private String newValue;
    private String field;
    
    private Long ticketId;
    private Long userId;
    
    private String userName;
    private String userAvatar;
    
    private LocalDateTime createdAt;
}
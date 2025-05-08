package com.ticketing.api.dto;

import com.fasterxml.jackson.annotation.JsonInclude;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@JsonInclude(JsonInclude.Include.NON_NULL)
public class TicketHistoryDTO {
    private Long id;
    private Long ticketId;
    private Long userId;
    private UserDTO user;
    private String action;
    private String fieldName;
    private String oldValue;
    private String newValue;
    private LocalDateTime createdAt;
}
package com.ticketing.api.dto;

import com.fasterxml.jackson.annotation.JsonInclude;
import com.ticketing.api.entity.Notification;
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
public class NotificationDTO {
    private Long id;
    private String message;
    private Notification.NotificationType type;
    private Long userId;
    private boolean read;
    private Long ticketId;
    private TicketDTO ticket;
    private LocalDateTime createdAt;
}
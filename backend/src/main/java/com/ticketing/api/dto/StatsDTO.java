package com.ticketing.api.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;
import java.util.Map;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class StatsDTO {
    
    // Basic stats
    private Long totalTickets;
    private Long openTickets;
    private Long inProgressTickets;
    private Long resolvedTickets;
    private Long closedTickets;
    
    private Long highPriorityCount;
    private Long mediumPriorityCount;
    private Long lowPriorityCount;
    
    private Double averageResolutionTimeInHours;
    private Double averageResponseTimeInHours;
    
    // List of recent activity
    private List<TicketHistoryDTO> recentActivity;
    
    // Ticket counts by various dimensions
    private Map<String, Long> ticketsByCategory;
    private Map<String, Long> ticketsByUser;
    private Map<String, Long> ticketsByMonth;
    private Map<String, Long> ticketsByStatus;
    private Map<String, Long> ticketsByPriority;
    
    // For user-specific stats
    private Long assignedToMeCount;
    private Long createdByMeCount;
    private Long resolvedByMeCount;
    
    // For time-based stats
    private Map<String, Long> createdTicketsByDay;
    private Map<String, Long> resolvedTicketsByDay;
}
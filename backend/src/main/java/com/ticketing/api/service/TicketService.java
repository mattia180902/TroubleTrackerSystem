package com.ticketing.api.service;

import com.ticketing.api.dto.TicketDTO;
import com.ticketing.api.dto.TicketStatsDTO;
import com.ticketing.api.entity.Category;
import com.ticketing.api.entity.Ticket;
import com.ticketing.api.entity.TicketHistory;
import com.ticketing.api.entity.User;
import com.ticketing.api.exception.ResourceNotFoundException;
import com.ticketing.api.mapper.TicketMapper;
import com.ticketing.api.repository.CategoryRepository;
import com.ticketing.api.repository.TicketHistoryRepository;
import com.ticketing.api.repository.TicketRepository;
import com.ticketing.api.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.Duration;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Objects;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class TicketService {
    
    private final TicketRepository ticketRepository;
    private final UserRepository userRepository;
    private final CategoryRepository categoryRepository;
    private final TicketHistoryRepository ticketHistoryRepository;
    private final TicketMapper ticketMapper;
    private final NotificationService notificationService;
    
    public List<TicketDTO> getAllTickets() {
        return ticketRepository.findAll().stream()
                .map(ticketMapper::toDTO)
                .collect(Collectors.toList());
    }
    
    public Page<TicketDTO> getTicketsPaginated(Pageable pageable) {
        return ticketRepository.findAll(pageable)
                .map(ticketMapper::toDTO);
    }
    
    public List<TicketDTO> getRecentTickets() {
        return ticketRepository.findTop5ByOrderByCreatedAtDesc().stream()
                .map(ticketMapper::toDTO)
                .collect(Collectors.toList());
    }
    
    public TicketDTO getTicketById(Long id) {
        Ticket ticket = ticketRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Ticket", "id", id));
        return ticketMapper.toDTO(ticket);
    }
    
    @Transactional
    public TicketDTO createTicket(TicketDTO ticketDTO) {
        // Get current user
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        String username = authentication.getName();
        User currentUser = userRepository.findByUsername(username)
                .orElseThrow(() -> new ResourceNotFoundException("User", "username", username));
        
        // Set created by user
        ticketDTO.setCreatedById(currentUser.getId());
        
        // Set default status if not provided
        if (ticketDTO.getStatus() == null) {
            ticketDTO.setStatus(Ticket.TicketStatus.OPEN);
        }
        
        // Set default priority if not provided
        if (ticketDTO.getPriority() == null) {
            ticketDTO.setPriority(Ticket.TicketPriority.MEDIUM);
        }
        
        // Validate category if provided
        if (ticketDTO.getCategoryId() != null) {
            categoryRepository.findById(ticketDTO.getCategoryId())
                    .orElseThrow(() -> new ResourceNotFoundException("Category", "id", ticketDTO.getCategoryId()));
        }
        
        // Validate assigned user if provided
        if (ticketDTO.getAssignedToId() != null) {
            userRepository.findById(ticketDTO.getAssignedToId())
                    .orElseThrow(() -> new ResourceNotFoundException("User", "id", ticketDTO.getAssignedToId()));
        }
        
        Ticket ticket = ticketMapper.toEntity(ticketDTO);
        Ticket savedTicket = ticketRepository.save(ticket);
        
        // Create ticket history
        createTicketHistory(savedTicket, currentUser, "CREATED", null, null, null);
        
        // Send notification to assigned user if any
        if (savedTicket.getAssignedTo() != null) {
            notificationService.createTicketAssignedNotification(savedTicket, savedTicket.getAssignedTo());
        }
        
        return ticketMapper.toDTO(savedTicket);
    }
    
    @Transactional
    public TicketDTO updateTicket(Long id, TicketDTO ticketDTO) {
        // Get current user
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        String username = authentication.getName();
        User currentUser = userRepository.findByUsername(username)
                .orElseThrow(() -> new ResourceNotFoundException("User", "username", username));
        
        Ticket ticket = ticketRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Ticket", "id", id));
        
        // Track changes for history
        Ticket.TicketStatus oldStatus = ticket.getStatus();
        Ticket.TicketPriority oldPriority = ticket.getPriority();
        User oldAssignedTo = ticket.getAssignedTo();
        Category oldCategory = ticket.getCategory();
        
        // Update fields
        ticketMapper.updateTicketFromDTO(ticketDTO, ticket);
        
        Ticket updatedTicket = ticketRepository.save(ticket);
        
        // Create ticket history for status change
        if (oldStatus != updatedTicket.getStatus()) {
            createTicketHistory(updatedTicket, currentUser, "STATUS_CHANGED", 
                    "status", oldStatus.name(), updatedTicket.getStatus().name());
            
            // Send notification for status change
            if (updatedTicket.getCreatedBy() != null && !updatedTicket.getCreatedBy().equals(currentUser)) {
                notificationService.createTicketStatusChangedNotification(updatedTicket, updatedTicket.getCreatedBy());
            }
        }
        
        // Create ticket history for priority change
        if (oldPriority != updatedTicket.getPriority()) {
            createTicketHistory(updatedTicket, currentUser, "PRIORITY_CHANGED", 
                    "priority", oldPriority.name(), updatedTicket.getPriority().name());
        }
        
        // Create ticket history for assignment change
        if (!Objects.equals(
                oldAssignedTo != null ? oldAssignedTo.getId() : null, 
                updatedTicket.getAssignedTo() != null ? updatedTicket.getAssignedTo().getId() : null)) {
            
            String oldValue = oldAssignedTo != null ? oldAssignedTo.getUsername() : "Unassigned";
            String newValue = updatedTicket.getAssignedTo() != null ? updatedTicket.getAssignedTo().getUsername() : "Unassigned";
            
            createTicketHistory(updatedTicket, currentUser, "ASSIGNMENT_CHANGED", 
                    "assignedTo", oldValue, newValue);
            
            // Send notification to newly assigned user
            if (updatedTicket.getAssignedTo() != null && !updatedTicket.getAssignedTo().equals(oldAssignedTo)) {
                notificationService.createTicketAssignedNotification(updatedTicket, updatedTicket.getAssignedTo());
            }
        }
        
        // Create ticket history for category change
        if (!Objects.equals(
                oldCategory != null ? oldCategory.getId() : null, 
                updatedTicket.getCategory() != null ? updatedTicket.getCategory().getId() : null)) {
            
            String oldValue = oldCategory != null ? oldCategory.getName() : "Uncategorized";
            String newValue = updatedTicket.getCategory() != null ? updatedTicket.getCategory().getName() : "Uncategorized";
            
            createTicketHistory(updatedTicket, currentUser, "CATEGORY_CHANGED", 
                    "category", oldValue, newValue);
        }
        
        return ticketMapper.toDTO(updatedTicket);
    }
    
    @Transactional
    public void deleteTicket(Long id) {
        Ticket ticket = ticketRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Ticket", "id", id));
        
        ticketRepository.delete(ticket);
    }
    
    @Transactional
    public List<TicketDTO> getTicketsForUser(Long userId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("User", "id", userId));
        
        return ticketRepository.findByCreatedBy(user, Pageable.unpaged()).stream()
                .map(ticketMapper::toDTO)
                .collect(Collectors.toList());
    }
    
    @Transactional
    public List<TicketDTO> getTicketsAssignedToUser(Long userId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("User", "id", userId));
        
        return ticketRepository.findByAssignedTo(user, Pageable.unpaged()).stream()
                .map(ticketMapper::toDTO)
                .collect(Collectors.toList());
    }
    
    @Transactional
    public TicketStatsDTO getTicketStats() {
        long totalTickets = ticketRepository.count();
        long openTickets = ticketRepository.countOpenTickets();
        long inProgressTickets = ticketRepository.countInProgressTickets();
        long resolvedTickets = ticketRepository.countResolvedTickets();
        long closedTickets = ticketRepository.countClosedTickets();
        long highPriorityCount = ticketRepository.countHighPriorityTickets();
        long mediumPriorityCount = ticketRepository.countMediumPriorityTickets();
        long lowPriorityCount = ticketRepository.countLowPriorityTickets();
        
        // Calculate average response time (simplified)
        String avgResponseTime = "N/A"; // This would be calculated in a real implementation
        
        return TicketStatsDTO.builder()
                .total(totalTickets)
                .openTickets(openTickets)
                .inProgressTickets(inProgressTickets)
                .resolvedTickets(resolvedTickets)
                .closedTickets(closedTickets)
                .highPriorityCount(highPriorityCount)
                .mediumPriorityCount(mediumPriorityCount)
                .lowPriorityCount(lowPriorityCount)
                .avgResponseTime(avgResponseTime)
                .build();
    }
    
    private void createTicketHistory(Ticket ticket, User user, String action, 
                                    String fieldName, String oldValue, String newValue) {
        TicketHistory history = TicketHistory.builder()
                .ticket(ticket)
                .user(user)
                .action(action)
                .fieldName(fieldName)
                .oldValue(oldValue)
                .newValue(newValue)
                .build();
        
        ticketHistoryRepository.save(history);
    }
}
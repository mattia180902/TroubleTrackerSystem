package com.ticketing.api.service;

import com.ticketing.api.dto.TicketHistoryDTO;
import com.ticketing.api.entity.Ticket;
import com.ticketing.api.entity.TicketHistory;
import com.ticketing.api.entity.User;
import com.ticketing.api.exception.ResourceNotFoundException;
import com.ticketing.api.repository.TicketHistoryRepository;
import com.ticketing.api.repository.TicketRepository;
import com.ticketing.api.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class TicketHistoryService {

    private final TicketHistoryRepository historyRepository;
    private final TicketRepository ticketRepository;
    private final UserRepository userRepository;

    @Autowired
    public TicketHistoryService(
            TicketHistoryRepository historyRepository,
            TicketRepository ticketRepository,
            UserRepository userRepository) {
        this.historyRepository = historyRepository;
        this.ticketRepository = ticketRepository;
        this.userRepository = userRepository;
    }

    public List<TicketHistoryDTO> getHistoryByTicketId(Long ticketId) {
        return historyRepository.findByTicketIdOrderByCreatedAtDesc(ticketId)
                .stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }

    @Transactional
    public TicketHistoryDTO createTicketHistory(Ticket ticket, String field, String oldValue, String newValue, Long userId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("User not found with id: " + userId));
        
        TicketHistory history = new TicketHistory();
        history.setTicket(ticket);
        history.setUser(user);
        history.setField(field);
        history.setOldValue(oldValue);
        history.setNewValue(newValue);
        history.setCreatedAt(LocalDateTime.now());
        
        TicketHistory savedHistory = historyRepository.save(history);
        return convertToDTO(savedHistory);
    }

    private TicketHistoryDTO convertToDTO(TicketHistory history) {
        TicketHistoryDTO dto = new TicketHistoryDTO();
        dto.setId(history.getId());
        dto.setField(history.getField());
        dto.setOldValue(history.getOldValue());
        dto.setNewValue(history.getNewValue());
        dto.setCreatedAt(history.getCreatedAt());
        dto.setTicketId(history.getTicket().getId());
        dto.setUserId(history.getUser().getId());
        
        // Set user info
        dto.setUserName(history.getUser().getFirstName() + " " + history.getUser().getLastName());
        dto.setUserRole(history.getUser().getRole().name());
        
        return dto;
    }
}
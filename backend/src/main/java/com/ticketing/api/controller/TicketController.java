package com.ticketing.api.controller;

import com.ticketing.api.dto.TicketDTO;
import com.ticketing.api.dto.TicketStatsDTO;
import com.ticketing.api.service.TicketService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/tickets")
@RequiredArgsConstructor
public class TicketController {
    
    private final TicketService ticketService;
    
    @GetMapping
    public ResponseEntity<List<TicketDTO>> getAllTickets() {
        List<TicketDTO> tickets = ticketService.getAllTickets();
        return ResponseEntity.ok(tickets);
    }
    
    @GetMapping("/paginated")
    public ResponseEntity<Page<TicketDTO>> getTicketsPaginated(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size,
            @RequestParam(defaultValue = "createdAt") String sortBy,
            @RequestParam(defaultValue = "desc") String sortDirection) {
        
        Sort.Direction direction = sortDirection.equalsIgnoreCase("asc") ? Sort.Direction.ASC : Sort.Direction.DESC;
        Pageable pageable = PageRequest.of(page, size, Sort.by(direction, sortBy));
        Page<TicketDTO> tickets = ticketService.getTicketsPaginated(pageable);
        
        return ResponseEntity.ok(tickets);
    }
    
    @GetMapping("/recent")
    public ResponseEntity<List<TicketDTO>> getRecentTickets() {
        List<TicketDTO> tickets = ticketService.getRecentTickets();
        return ResponseEntity.ok(tickets);
    }
    
    @GetMapping("/{id}")
    public ResponseEntity<TicketDTO> getTicketById(@PathVariable Long id) {
        TicketDTO ticket = ticketService.getTicketById(id);
        return ResponseEntity.ok(ticket);
    }
    
    @PostMapping
    public ResponseEntity<TicketDTO> createTicket(@Valid @RequestBody TicketDTO ticketDTO) {
        TicketDTO createdTicket = ticketService.createTicket(ticketDTO);
        return new ResponseEntity<>(createdTicket, HttpStatus.CREATED);
    }
    
    @PutMapping("/{id}")
    public ResponseEntity<TicketDTO> updateTicket(@PathVariable Long id, @Valid @RequestBody TicketDTO ticketDTO) {
        TicketDTO updatedTicket = ticketService.updateTicket(id, ticketDTO);
        return ResponseEntity.ok(updatedTicket);
    }
    
    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Void> deleteTicket(@PathVariable Long id) {
        ticketService.deleteTicket(id);
        return ResponseEntity.noContent().build();
    }
    
    @GetMapping("/user/{userId}")
    public ResponseEntity<List<TicketDTO>> getTicketsForUser(@PathVariable Long userId) {
        List<TicketDTO> tickets = ticketService.getTicketsForUser(userId);
        return ResponseEntity.ok(tickets);
    }
    
    @GetMapping("/assigned/{userId}")
    public ResponseEntity<List<TicketDTO>> getTicketsAssignedToUser(@PathVariable Long userId) {
        List<TicketDTO> tickets = ticketService.getTicketsAssignedToUser(userId);
        return ResponseEntity.ok(tickets);
    }
    
    @GetMapping("/stats")
    public ResponseEntity<TicketStatsDTO> getTicketStats() {
        TicketStatsDTO stats = ticketService.getTicketStats();
        return ResponseEntity.ok(stats);
    }
}
package com.ticketing.api.controller;

import com.ticketing.api.dto.TicketDTO;
import com.ticketing.api.dto.TicketHistoryDTO;
import com.ticketing.api.enums.Priority;
import com.ticketing.api.enums.Status;
import com.ticketing.api.service.TicketHistoryService;
import com.ticketing.api.service.TicketService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.web.PageableDefault;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import javax.validation.Valid;
import java.util.List;

@RestController
@RequestMapping("/tickets")
public class TicketController {

    private final TicketService ticketService;
    private final TicketHistoryService historyService;

    @Autowired
    public TicketController(TicketService ticketService, TicketHistoryService historyService) {
        this.ticketService = ticketService;
        this.historyService = historyService;
    }

    @GetMapping
    public ResponseEntity<List<TicketDTO>> getAllTickets(
            @RequestParam(required = false) Status status,
            @RequestParam(required = false) Priority priority,
            @RequestParam(required = false) Long categoryId,
            @RequestParam(required = false) Long createdById,
            @RequestParam(required = false) Long assignedToId) {
        
        List<TicketDTO> tickets = ticketService.getTicketsWithFilters(
                status, priority, categoryId, createdById, assignedToId);
        return ResponseEntity.ok(tickets);
    }

    @GetMapping("/paged")
    public ResponseEntity<Page<TicketDTO>> getTicketsPaginated(
            @RequestParam(required = false) Status status,
            @RequestParam(required = false) Priority priority,
            @RequestParam(required = false) Long categoryId,
            @RequestParam(required = false) Long createdById,
            @RequestParam(required = false) Long assignedToId,
            @PageableDefault(size = 10) Pageable pageable) {
        
        Page<TicketDTO> tickets = ticketService.getTicketsWithFiltersPaginated(
                status, priority, categoryId, createdById, assignedToId, pageable);
        return ResponseEntity.ok(tickets);
    }

    @GetMapping("/search")
    public ResponseEntity<List<TicketDTO>> searchTickets(@RequestParam String query) {
        return ResponseEntity.ok(ticketService.searchTickets(query));
    }

    @GetMapping("/{id}")
    public ResponseEntity<TicketDTO> getTicketById(@PathVariable Long id) {
        return ResponseEntity.ok(ticketService.getTicketById(id));
    }

    @GetMapping("/{id}/history")
    public ResponseEntity<List<TicketHistoryDTO>> getTicketHistory(@PathVariable Long id) {
        return ResponseEntity.ok(historyService.getHistoryByTicketId(id));
    }

    @PostMapping
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<TicketDTO> createTicket(
            @Valid @RequestBody TicketDTO ticketDTO,
            Authentication authentication) {
        
        // In a real implementation, we would extract user id from the Authentication object
        // For now, we're using a placeholder
        Long userId = 1L; // Placeholder
        
        return new ResponseEntity<>(ticketService.createTicket(ticketDTO, userId), HttpStatus.CREATED);
    }

    @PutMapping("/{id}")
    @PreAuthorize("hasAnyRole('ADMIN', 'AGENT') or @ticketSecurity.isTicketCreator(#id, authentication)")
    public ResponseEntity<TicketDTO> updateTicket(
            @PathVariable Long id,
            @Valid @RequestBody TicketDTO ticketDTO,
            Authentication authentication) {
        
        // In a real implementation, we would extract user id from the Authentication object
        Long userId = 1L; // Placeholder
        
        return ResponseEntity.ok(ticketService.updateTicket(id, ticketDTO, userId));
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Void> deleteTicket(@PathVariable Long id) {
        ticketService.deleteTicket(id);
        return ResponseEntity.noContent().build();
    }

    @PostMapping("/{id}/status")
    @PreAuthorize("hasAnyRole('ADMIN', 'AGENT') or @ticketSecurity.isTicketCreator(#id, authentication)")
    public ResponseEntity<TicketDTO> changeStatus(
            @PathVariable Long id,
            @RequestParam Status status,
            Authentication authentication) {
        
        // In a real implementation, we would extract user id from the Authentication object
        Long userId = 1L; // Placeholder
        
        return ResponseEntity.ok(ticketService.changeStatus(id, status, userId));
    }

    @PostMapping("/{id}/assign")
    @PreAuthorize("hasAnyRole('ADMIN', 'AGENT')")
    public ResponseEntity<TicketDTO> assignTicket(
            @PathVariable Long id,
            @RequestParam Long assigneeId,
            Authentication authentication) {
        
        // In a real implementation, we would extract user id from the Authentication object
        Long userId = 1L; // Placeholder
        
        return ResponseEntity.ok(ticketService.assignTicket(id, assigneeId, userId));
    }
}
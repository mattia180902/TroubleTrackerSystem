package com.ticketing.api.repository;

import com.ticketing.api.entity.Ticket;
import com.ticketing.api.entity.User;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface TicketRepository extends JpaRepository<Ticket, Long>, JpaSpecificationExecutor<Ticket> {
    Page<Ticket> findByCreatedBy(User user, Pageable pageable);
    Page<Ticket> findByAssignedTo(User user, Pageable pageable);
    
    @Query("SELECT COUNT(t) FROM Ticket t WHERE t.status = 'OPEN'")
    long countOpenTickets();
    
    @Query("SELECT COUNT(t) FROM Ticket t WHERE t.status = 'IN_PROGRESS'")
    long countInProgressTickets();
    
    @Query("SELECT COUNT(t) FROM Ticket t WHERE t.status = 'RESOLVED'")
    long countResolvedTickets();
    
    @Query("SELECT COUNT(t) FROM Ticket t WHERE t.status = 'CLOSED'")
    long countClosedTickets();
    
    @Query("SELECT COUNT(t) FROM Ticket t WHERE t.priority = 'HIGH'")
    long countHighPriorityTickets();
    
    @Query("SELECT COUNT(t) FROM Ticket t WHERE t.priority = 'MEDIUM'")
    long countMediumPriorityTickets();
    
    @Query("SELECT COUNT(t) FROM Ticket t WHERE t.priority = 'LOW'")
    long countLowPriorityTickets();
    
    List<Ticket> findTop5ByOrderByCreatedAtDesc();
    
    @Query("SELECT t FROM Ticket t WHERE (t.assignedTo IS NULL OR t.assignedTo.id = ?1) AND t.status <> 'CLOSED' ORDER BY t.priority DESC, t.createdAt ASC")
    List<Ticket> findTicketsForAgent(Long agentId, Pageable pageable);
}
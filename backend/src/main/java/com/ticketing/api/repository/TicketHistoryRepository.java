package com.ticketing.api.repository;

import com.ticketing.api.entity.TicketHistory;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface TicketHistoryRepository extends JpaRepository<TicketHistory, Long> {
    
    List<TicketHistory> findByTicketId(Long ticketId);
    
    Page<TicketHistory> findByTicketId(Long ticketId, Pageable pageable);
    
    List<TicketHistory> findByUserId(Long userId);
    
    @Query("SELECT th FROM TicketHistory th WHERE th.ticket.id = :ticketId ORDER BY th.createdAt DESC")
    List<TicketHistory> findByTicketIdOrderByCreatedAtDesc(Long ticketId);
    
    @Query("SELECT th FROM TicketHistory th JOIN th.ticket t ORDER BY th.createdAt DESC")
    Page<TicketHistory> findAllRecentActivity(Pageable pageable);
    
    @Query("SELECT th FROM TicketHistory th WHERE th.field = :field AND th.ticket.id = :ticketId ORDER BY th.createdAt DESC")
    List<TicketHistory> findByFieldAndTicketId(String field, Long ticketId);
    
    @Query("SELECT th FROM TicketHistory th WHERE th.action = :action ORDER BY th.createdAt DESC")
    List<TicketHistory> findByAction(String action);
}
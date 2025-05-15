package com.ticketing.api.repository;

import com.ticketing.api.entity.TicketHistory;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface TicketHistoryRepository extends JpaRepository<TicketHistory, Long> {
    
    List<TicketHistory> findByTicketIdOrderByCreatedAtDesc(Long ticketId);
    
    @Query("SELECT th FROM TicketHistory th WHERE th.ticket.id = :ticketId AND th.field = :field ORDER BY th.createdAt DESC")
    List<TicketHistory> findByTicketIdAndFieldOrderByCreatedAtDesc(@Param("ticketId") Long ticketId, @Param("field") String field);
    
    @Query("SELECT th FROM TicketHistory th WHERE th.user.id = :userId ORDER BY th.createdAt DESC")
    List<TicketHistory> findByUserIdOrderByCreatedAtDesc(@Param("userId") Long userId);
    
    @Query("SELECT COUNT(th) FROM TicketHistory th WHERE th.ticket.id = :ticketId")
    Long countByTicketId(@Param("ticketId") Long ticketId);
}
package com.ticketing.api.repository;

import com.ticketing.api.entity.Ticket;
import com.ticketing.api.entity.TicketHistory;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface TicketHistoryRepository extends JpaRepository<TicketHistory, Long> {
    List<TicketHistory> findByTicketOrderByCreatedAtAsc(Ticket ticket);
    List<TicketHistory> findByTicketIdOrderByCreatedAtAsc(Long ticketId);
}